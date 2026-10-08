from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.permissions import IsAuthenticated

from .models import Budget
from .serializers import BudgetSerializer


class BudgetListCreateView(ListCreateAPIView):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Budget.objects.filter(user=self.request.user)
        month = self.request.query_params.get("month")
        year = self.request.query_params.get("year")
        category = self.request.query_params.get("category")

        if month and month.isdigit():
            qs = qs.filter(month=int(month))
        if year and year.isdigit():
            qs = qs.filter(year=int(year))
        if category:
            qs = qs.filter(category=category)

        return qs.order_by("-year", "-month", "category")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BudgetDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)