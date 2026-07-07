from django.shortcuts import render

# Create your views here.
from django.db.models import Sum
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from transactions.models import Income, Expense


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_income = (
            Income.objects.filter(user=request.user)
            .aggregate(total=Sum("amount"))["total"]
            or 0
        )

        total_expense = (
            Expense.objects.filter(user=request.user)
            .aggregate(total=Sum("amount"))["total"]
            or 0
        )

        remaining_balance = total_income - total_expense

        return Response(
            {
                "total_income": total_income,
                "total_expense": total_expense,
                "remaining_balance": remaining_balance,
            }
        )