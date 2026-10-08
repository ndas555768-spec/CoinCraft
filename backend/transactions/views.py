from decimal import Decimal
from django.db.models import Q
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Expense, Income
from .serializers import ExpenseSerializer, IncomeSerializer


class IncomeListCreateView(ListCreateAPIView):
    serializer_class = IncomeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Income.objects.filter(user=self.request.user)

        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(Q(source__icontains=search) | Q(description__icontains=search))

        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category=category)

        start_date = self.request.query_params.get("start_date")
        if start_date:
            qs = qs.filter(date__gte=start_date)

        end_date = self.request.query_params.get("end_date")
        if end_date:
            qs = qs.filter(date__lte=end_date)

        ordering = self.request.query_params.get("ordering", "-date")
        valid_orderings = ["date", "-date", "amount", "-amount", "source", "-source", "created_at", "-created_at"]
        if ordering in valid_orderings:
            qs = qs.order_by(ordering, "-id")
        else:
            qs = qs.order_by("-date", "-id")

        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class IncomeDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = IncomeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Income.objects.filter(user=self.request.user)


class ExpenseListCreateView(ListCreateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Expense.objects.filter(user=self.request.user)

        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(Q(title__icontains=search) | Q(description__icontains=search))

        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category=category)

        payment_method = self.request.query_params.get("payment_method")
        if payment_method:
            qs = qs.filter(payment_method=payment_method)

        start_date = self.request.query_params.get("start_date")
        if start_date:
            qs = qs.filter(date__gte=start_date)

        end_date = self.request.query_params.get("end_date")
        if end_date:
            qs = qs.filter(date__lte=end_date)

        ordering = self.request.query_params.get("ordering", "-date")
        valid_orderings = ["date", "-date", "amount", "-amount", "title", "-title", "created_at", "-created_at"]
        if ordering in valid_orderings:
            qs = qs.order_by(ordering, "-id")
        else:
            qs = qs.order_by("-date", "-id")

        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ExpenseDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)


class UnifiedTransactionListView(APIView):
    """
    Returns both incomes and expenses merged and sorted by date for global search & unified timeline.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        search = request.query_params.get("search", "").strip()
        category = request.query_params.get("category", "").strip()
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")
        t_type = request.query_params.get("type", "").strip().lower()  # "income", "expense", or empty

        transactions = []

        if t_type != "expense":
            incomes_qs = Income.objects.filter(user=user)
            if search:
                incomes_qs = incomes_qs.filter(Q(source__icontains=search) | Q(description__icontains=search))
            if category:
                incomes_qs = incomes_qs.filter(category=category)
            if start_date:
                incomes_qs = incomes_qs.filter(date__gte=start_date)
            if end_date:
                incomes_qs = incomes_qs.filter(date__lte=end_date)

            for inc in incomes_qs:
                transactions.append({
                    "id": inc.id,
                    "type": "income",
                    "title": inc.source,
                    "category": inc.category,
                    "amount": str(inc.amount),
                    "date": inc.date.isoformat(),
                    "payment_method": "N/A",
                    "description": inc.description,
                    "created_at": inc.created_at.isoformat() if inc.created_at else None,
                })

        if t_type != "income":
            expenses_qs = Expense.objects.filter(user=user)
            if search:
                expenses_qs = expenses_qs.filter(Q(title__icontains=search) | Q(description__icontains=search))
            if category:
                expenses_qs = expenses_qs.filter(category=category)
            if start_date:
                expenses_qs = expenses_qs.filter(date__gte=start_date)
            if end_date:
                expenses_qs = expenses_qs.filter(date__lte=end_date)
            payment_method = request.query_params.get("payment_method")
            if payment_method:
                expenses_qs = expenses_qs.filter(payment_method=payment_method)

            for exp in expenses_qs:
                transactions.append({
                    "id": exp.id,
                    "type": "expense",
                    "title": exp.title,
                    "category": exp.category,
                    "amount": str(exp.amount),
                    "date": exp.date.isoformat(),
                    "payment_method": exp.payment_method,
                    "description": exp.description,
                    "created_at": exp.created_at.isoformat() if exp.created_at else None,
                })

        # Sort combined results by date descending
        transactions.sort(key=lambda t: t["date"], reverse=True)
        limit = request.query_params.get("limit")
        if limit and limit.isdigit():
            transactions = transactions[:int(limit)]

        return Response(transactions, status=status.HTTP_200_OK)