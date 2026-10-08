from datetime import date
from decimal import Decimal
from django.db.models import Sum
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from budgets.models import Budget
from budgets.serializers import BudgetSerializer
from goals.models import Goal
from goals.serializers import GoalSerializer
from transactions.models import Expense, Income


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        now = timezone.now()
        current_year = now.year
        current_month = now.month

        # 1. Total All-time Summary
        total_income = (
            Income.objects.filter(user=user).aggregate(total=Sum("amount"))["total"]
            or Decimal("0.00")
        )
        total_expense = (
            Expense.objects.filter(user=user).aggregate(total=Sum("amount"))["total"]
            or Decimal("0.00")
        )
        balance = total_income - total_expense
        total_savings = (
            Goal.objects.filter(user=user).aggregate(total=Sum("saved_amount"))["total"]
            or Decimal("0.00")
        )

        # 2. Current Month Summary
        month_income = (
            Income.objects.filter(
                user=user, date__year=current_year, date__month=current_month
            ).aggregate(total=Sum("amount"))["total"]
            or Decimal("0.00")
        )
        month_expense = (
            Expense.objects.filter(
                user=user, date__year=current_year, date__month=current_month
            ).aggregate(total=Sum("amount"))["total"]
            or Decimal("0.00")
        )
        month_net = month_income - month_expense

        # 3. Monthly Trend (Past 6 calendar months)
        monthly_trend = []
        # Generate the last 6 months in chronological order
        months_to_query = []
        temp_date = date(current_year, current_month, 1)
        for _ in range(6):
            months_to_query.append((temp_date.year, temp_date.month, temp_date.strftime("%b %Y"), temp_date.strftime("%b")))
            # Go to previous month
            if temp_date.month == 1:
                temp_date = date(temp_date.year - 1, 12, 1)
            else:
                temp_date = date(temp_date.year, temp_date.month - 1, 1)

        months_to_query.reverse()

        for yr, mo, full_label, short_label in months_to_query:
            m_inc = (
                Income.objects.filter(user=user, date__year=yr, date__month=mo).aggregate(total=Sum("amount"))["total"]
                or Decimal("0.00")
            )
            m_exp = (
                Expense.objects.filter(user=user, date__year=yr, date__month=mo).aggregate(total=Sum("amount"))["total"]
                or Decimal("0.00")
            )
            monthly_trend.append({
                "month": short_label,
                "label": full_label,
                "income": float(m_inc),
                "expense": float(m_exp),
                "net": float(m_inc - m_exp),
            })

        # 4. Category Breakdown (Expenses)
        category_rows = (
            Expense.objects.filter(user=user)
            .values("category")
            .annotate(total=Sum("amount"))
            .order_by("-total")
        )
        category_breakdown = []
        for row in category_rows:
            cat_total = row["total"] or Decimal("0.00")
            pct = round(float((cat_total / total_expense) * 100), 2) if total_expense > 0 else 0.0
            category_breakdown.append({
                "category": row["category"],
                "amount": float(cat_total),
                "percentage": pct,
            })

        # 5. Recent Combined Transactions (Latest 5 items)
        recent_transactions = []
        recent_incomes = Income.objects.filter(user=user).order_by("-date", "-id")[:5]
        recent_expenses = Expense.objects.filter(user=user).order_by("-date", "-id")[:5]

        for inc in recent_incomes:
            recent_transactions.append({
                "id": f"inc-{inc.id}",
                "transaction_id": inc.id,
                "type": "income",
                "title": inc.source,
                "category": inc.category,
                "amount": str(inc.amount),
                "date": inc.date.isoformat(),
                "payment_method": "N/A",
            })

        for exp in recent_expenses:
            recent_transactions.append({
                "id": f"exp-{exp.id}",
                "transaction_id": exp.id,
                "type": "expense",
                "title": exp.title,
                "category": exp.category,
                "amount": str(exp.amount),
                "date": exp.date.isoformat(),
                "payment_method": exp.payment_method,
            })

        recent_transactions.sort(key=lambda t: t["date"], reverse=True)
        recent_transactions = recent_transactions[:5]

        # 6. Current Budgets
        current_budgets = Budget.objects.filter(user=user, year=current_year, month=current_month)
        budget_serializer = BudgetSerializer(current_budgets, many=True, context={"request": request})

        # 7. Goals
        goals = Goal.objects.filter(user=user).order_by("-created_at")[:4]
        goals_serializer = GoalSerializer(goals, many=True)

        return Response(
            {
                "summary": {
                    "total_income": str(total_income),
                    "total_expense": str(total_expense),
                    "balance": str(balance),
                    "total_savings": str(total_savings),
                },
                "monthly_summary": {
                    "month": current_month,
                    "year": current_year,
                    "income": str(month_income),
                    "expense": str(month_expense),
                    "savings": str(month_net),
                },
                "recent_transactions": recent_transactions,
                "monthly_trend": monthly_trend,
                "category_breakdown": category_breakdown,
                "budget_summary": budget_serializer.data,
                "goals": goals_serializer.data,
            },
            status=status.HTTP_200_OK,
        )