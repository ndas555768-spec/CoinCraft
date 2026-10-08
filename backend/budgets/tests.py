from decimal import Decimal
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from transactions.models import Expense
from .models import Budget

User = get_user_model()


class BudgetsAPITests(APITestCase):
    def setUp(self):
        self.user_a = User.objects.create_user(username="userA", email="a@example.com", password="Pass123!A")
        self.user_b = User.objects.create_user(username="userB", email="b@example.com", password="Pass123!B")

        # Create budget for User A: Food, October 2026, 10,000
        self.budget_a = Budget.objects.create(
            user=self.user_a,
            category="Food",
            amount=Decimal("10000.00"),
            month=10,
            year=2026,
        )

        # Expense for User A in Food in October 2026: 8500
        Expense.objects.create(
            user=self.user_a,
            title="Supermarket",
            category="Food",
            amount=Decimal("8500.00"),
            payment_method="UPI",
            date="2026-10-04",
        )

        # Budget for User B
        self.budget_b = Budget.objects.create(
            user=self.user_b,
            category="Shopping",
            amount=Decimal("5000.00"),
            month=10,
            year=2026,
        )

    def test_budget_calculations_and_status(self):
        self.client.force_authenticate(user=self.user_a)
        res = self.client.get(reverse("budget-list-create"))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)

        b = res.data[0]
        self.assertEqual(Decimal(b["amount"]), Decimal("10000.00"))
        self.assertEqual(Decimal(b["spent"]), Decimal("8500.00"))
        self.assertEqual(Decimal(b["remaining"]), Decimal("1500.00"))
        self.assertEqual(b["percentage_used"], 85.0)
        self.assertEqual(b["status"], "warning")  # 85% used -> warning

    def test_duplicate_budget_prevention(self):
        self.client.force_authenticate(user=self.user_a)
        res = self.client.post(
            reverse("budget-list-create"),
            {
                "category": "Food",
                "amount": "12000.00",
                "month": 10,
                "year": 2026,
            },
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("category", res.data)

    def test_user_data_isolation(self):
        self.client.force_authenticate(user=self.user_a)

        # Cannot see User B's budget
        res = self.client.get(reverse("budget-list-create"))
        ids = [item["id"] for item in res.data]
        self.assertNotIn(self.budget_b.id, ids)

        # Cannot get, update or delete User B's budget
        detail_res = self.client.get(reverse("budget-detail", kwargs={"pk": self.budget_b.id}))
        self.assertEqual(detail_res.status_code, status.HTTP_404_NOT_FOUND)

        del_res = self.client.delete(reverse("budget-detail", kwargs={"pk": self.budget_b.id}))
        self.assertEqual(del_res.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(Budget.objects.filter(id=self.budget_b.id).exists())
