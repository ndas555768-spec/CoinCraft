from decimal import Decimal
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from budgets.models import Budget
from goals.models import Goal
from transactions.models import Expense, Income

User = get_user_model()


class DashboardAPITests(APITestCase):
    def setUp(self):
        self.user_a = User.objects.create_user(username="userA", email="a@example.com", password="Pass123!A")
        self.user_b = User.objects.create_user(username="userB", email="b@example.com", password="Pass123!B")

        # Income for User A
        Income.objects.create(
            user=self.user_a,
            source="Salary",
            category="Salary",
            amount=Decimal("50000.00"),
            date="2026-10-01",
        )
        Income.objects.create(
            user=self.user_a,
            source="Freelance",
            category="Freelance",
            amount=Decimal("15000.00"),
            date="2026-10-02",
        )

        # Expense for User A
        Expense.objects.create(
            user=self.user_a,
            title="Groceries",
            category="Food",
            amount=Decimal("8000.00"),
            payment_method="UPI",
            date="2026-10-03",
        )
        Expense.objects.create(
            user=self.user_a,
            title="Rent",
            category="Bills",
            amount=Decimal("12000.00"),
            payment_method="Bank Transfer",
            date="2026-10-04",
        )

        # Goal for User A
        Goal.objects.create(
            user=self.user_a,
            title="Emergency Fund",
            target_amount=Decimal("100000.00"),
            saved_amount=Decimal("25000.00"),
            target_date="2027-12-31",
        )

        # Financials for User B (must NOT bleed into User A's dashboard)
        Income.objects.create(
            user=self.user_b,
            source="Big Corporate",
            category="Salary",
            amount=Decimal("200000.00"),
            date="2026-10-01",
        )
        Expense.objects.create(
            user=self.user_b,
            title="Luxury Watch",
            category="Shopping",
            amount=Decimal("90000.00"),
            payment_method="Card",
            date="2026-10-02",
        )

    def test_dashboard_calculations_and_user_isolation(self):
        self.client.force_authenticate(user=self.user_a)
        res = self.client.get(reverse("dashboard"))
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # User A total income = 50,000 + 15,000 = 65,000
        # Total expense = 8,000 + 12,000 = 20,000
        # Balance = 45,000
        # Savings = 25,000
        summary = res.data["summary"]
        self.assertEqual(Decimal(summary["total_income"]), Decimal("65000.00"))
        self.assertEqual(Decimal(summary["total_expense"]), Decimal("20000.00"))
        self.assertEqual(Decimal(summary["balance"]), Decimal("45000.00"))
        self.assertEqual(Decimal(summary["total_savings"]), Decimal("25000.00"))

        # Verify recent transactions
        recent = res.data["recent_transactions"]
        self.assertTrue(len(recent) > 0)
        # None of the recent transactions should be from User B
        titles = [t["title"] for t in recent]
        self.assertNotIn("Big Corporate", titles)
        self.assertNotIn("Luxury Watch", titles)

        # Category breakdown
        cat_breakdown = res.data["category_breakdown"]
        categories = [c["category"] for c in cat_breakdown]
        self.assertIn("Food", categories)
        self.assertIn("Bills", categories)
        self.assertNotIn("Shopping", categories)  # User B's Shopping expense
