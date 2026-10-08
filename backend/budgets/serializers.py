from decimal import Decimal
from django.db.models import Sum
from rest_framework import serializers

from transactions.models import Expense
from .models import Budget


class BudgetSerializer(serializers.ModelSerializer):
    spent = serializers.SerializerMethodField()
    remaining = serializers.SerializerMethodField()
    percentage_used = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=Decimal("0.01"))
    month = serializers.IntegerField(min_value=1, max_value=12)
    year = serializers.IntegerField(min_value=2000, max_value=2100)

    class Meta:
        model = Budget
        fields = [
            "id",
            "category",
            "amount",
            "month",
            "year",
            "spent",
            "remaining",
            "percentage_used",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "spent",
            "remaining",
            "percentage_used",
            "status",
            "created_at",
            "updated_at",
        ]

    def _get_spent(self, obj):
        total = (
            Expense.objects.filter(
                user=obj.user,
                category=obj.category,
                date__year=obj.year,
                date__month=obj.month,
            ).aggregate(total=Sum("amount"))["total"]
            or Decimal("0.00")
        )
        return total

    def get_spent(self, obj):
        return str(self._get_spent(obj))

    def get_remaining(self, obj):
        spent = self._get_spent(obj)
        remaining = obj.amount - spent
        return str(remaining if remaining > Decimal("0.00") else Decimal("0.00"))

    def get_percentage_used(self, obj):
        spent = self._get_spent(obj)
        if obj.amount and obj.amount > Decimal("0.00"):
            percent = (spent / obj.amount) * Decimal("100")
            return round(float(percent), 2)
        return 0.0

    def get_status(self, obj):
        spent = self._get_spent(obj)
        if spent > obj.amount:
            return "exceeded"
        if spent >= (obj.amount * Decimal("0.80")):
            return "warning"
        return "normal"

    def validate(self, attrs):
        request = self.context.get("request")
        user = request.user if request else getattr(self.instance, "user", None)

        category = attrs.get("category", getattr(self.instance, "category", None))
        month = attrs.get("month", getattr(self.instance, "month", None))
        year = attrs.get("year", getattr(self.instance, "year", None))

        if user and category and month and year:
            qs = Budget.objects.filter(user=user, category=category, month=month, year=year)
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)
            if qs.exists():
                raise serializers.ValidationError(
                    {"category": f"A budget for {category} in {month}/{year} already exists."}
                )

        return attrs