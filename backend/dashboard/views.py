from django.db.models import Sum
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from transactions.models import Income, Expense
from budgets.models import Budget


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        # Total Income
        total_income = (
            Income.objects.filter(user=request.user)
            .aggregate(total=Sum("amount"))["total"]
            or 0
        )

        # Total Expense
        total_expense = (
            Expense.objects.filter(user=request.user)
            .aggregate(total=Sum("amount"))["total"]
            or 0
        )

        # Remaining Balance
        remaining_balance = total_income - total_expense

        # Budget Summary
        budgets = Budget.objects.filter(user=request.user)

        budget_summary = []

        for budget in budgets:

            spent = (
                Expense.objects.filter(
                    user=request.user,
                    category=budget.category,
                ).aggregate(total=Sum("amount"))["total"]
                or 0
            )

            remaining = budget.amount - spent

            percentage_used = (
                (spent / budget.amount) * 100
                if budget.amount > 0
                else 0
            )

            budget_summary.append(
                {
                    "category": budget.category,
                    "budget": budget.amount,
                    "spent": spent,
                    "remaining": remaining,
                    "percentage_used": round(percentage_used, 2),
                }
            )

        return Response(
            {
                "total_income": total_income,
                "total_expense": total_expense,
                "remaining_balance": remaining_balance,
                "budget_summary": budget_summary,
            }
        )