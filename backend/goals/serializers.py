from decimal import Decimal
from django.utils import timezone
from rest_framework import serializers
from .models import Goal


class GoalSerializer(serializers.ModelSerializer):
    target_amount = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=Decimal("0.01"))
    saved_amount = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=Decimal("0.00"), default=Decimal("0.00"))
    remaining_amount = serializers.SerializerMethodField()
    percentage_completed = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = Goal
        fields = [
            "id",
            "title",
            "target_amount",
            "saved_amount",
            "remaining_amount",
            "percentage_completed",
            "status",
            "target_date",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "remaining_amount",
            "percentage_completed",
            "status",
            "created_at",
            "updated_at",
        ]

    def get_remaining_amount(self, obj):
        diff = obj.target_amount - obj.saved_amount
        return str(diff if diff > Decimal("0.00") else Decimal("0.00"))

    def get_percentage_completed(self, obj):
        if obj.target_amount and obj.target_amount > Decimal("0.00"):
            percent = (obj.saved_amount / obj.target_amount) * Decimal("100")
            return min(round(float(percent), 2), 100.0)
        return 0.0

    def get_status(self, obj):
        if obj.saved_amount >= obj.target_amount:
            return "completed"
        if obj.target_date and obj.target_date < timezone.now().date():
            return "overdue"
        return "in_progress"

    def validate(self, attrs):
        target = attrs.get("target_amount", getattr(self.instance, "target_amount", None))
        saved = attrs.get("saved_amount", getattr(self.instance, "saved_amount", Decimal("0.00")))
        if target is not None and target <= 0:
            raise serializers.ValidationError({"target_amount": "Target amount must be greater than zero."})
        if saved is not None and saved < 0:
            raise serializers.ValidationError({"saved_amount": "Saved amount cannot be negative."})
        return attrs