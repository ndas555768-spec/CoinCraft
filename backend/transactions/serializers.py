from rest_framework import serializers
from .models import Expense, Income


class IncomeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Income
        fields = [
            "id",
            "source",
            "category",
            "amount",
            "date",
            "description",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

class ExpenseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Expense
        fields = [
            "id",
            "title",
            "category",
            "amount",
            "payment_method",
            "date",
            "description",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]