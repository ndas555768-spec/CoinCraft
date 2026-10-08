from decimal import Decimal
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Expense, Income

User = get_user_model()


class TransactionsAPITests(APITestCase):
    def setUp(self):
        self.user_a = User.objects.create_user(username="userA", email="a@example.com", password="Pass123!A")
        self.user_b = User.objects.create_user(username="userB", email="b@example.com", password="Pass123!B")

        # Income for User A
        self.inc_a = Income.objects.create(
            user=self.user_a,
            source="TechCorp",
            category="Salary",
            amount=Decimal("50000.00"),
            date="2026-10-01",
            description="Monthly salary",
        )

        # Expense for User A
        self.exp_a = Expense.objects.create(
            user=self.user_a,
            title="Groceries",
            category="Food",
            amount=Decimal("3500.00"),
            payment_method="UPI",
            date="2026-10-02",
            description="Supermarket",
        )

        # Income and Expense for User B
        self.inc_b = Income.objects.create(
            user=self.user_b,
            source="Design Agency",
            category="Freelance",
            amount=Decimal("20000.00"),
            date="2026-10-01",
        )
        self.exp_b = Expense.objects.create(
            user=self.user_b,
            title="Train Ticket",
            category="Transport",
            amount=Decimal("500.00"),
            payment_method="Card",
            date="2026-10-03",
        )

    def test_income_crud_and_validation(self):
        self.client.force_authenticate(user=self.user_a)

        # Create
        res = self.client.post(
            reverse("income-list-create"),
            {
                "source": "Stock Dividend",
                "category": "Investment",
                "amount": "1200.00",
                "date": "2026-10-05",
                "description": "Quarterly dividend",
            },
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Income.objects.filter(user=self.user_a).count(), 2)

        # Negative amount validation
        bad_res = self.client.post(
            reverse("income-list-create"),
            {"source": "Bad", "category": "Gift", "amount": "-10.00", "date": "2026-10-05"},
            format="json",
        )
        self.assertEqual(bad_res.status_code, status.HTTP_400_BAD_REQUEST)

        # Update
        inc_id = res.data["id"]
        update_res = self.client.patch(
            reverse("income-detail", kwargs={"pk": inc_id}),
            {"amount": "1500.00"},
            format="json",
        )
        self.assertEqual(update_res.status_code, status.HTTP_200_OK)
        self.assertEqual(Decimal(update_res.data["amount"]), Decimal("1500.00"))

        # Delete
        del_res = self.client.delete(reverse("income-detail", kwargs={"pk": inc_id}))
        self.assertEqual(del_res.status_code, status.HTTP_204_NO_CONTENT)

    def test_expense_crud_and_filtering(self):
        self.client.force_authenticate(user=self.user_a)

        # Create
        res = self.client.post(
            reverse("expense-list-create"),
            {
                "title": "Bus Pass",
                "category": "Transport",
                "amount": "800.00",
                "payment_method": "Card",
                "date": "2026-10-04",
                "description": "Monthly commute pass",
            },
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        # Filter by category
        filter_res = self.client.get(reverse("expense-list-create") + "?category=Transport")
        self.assertEqual(filter_res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(filter_res.data), 1)
        self.assertEqual(filter_res.data[0]["title"], "Bus Pass")

    def test_user_data_isolation(self):
        # User A should NOT see or modify User B's records
        self.client.force_authenticate(user=self.user_a)

        # Cannot see User B's income
        list_res = self.client.get(reverse("income-list-create"))
        income_ids = [item["id"] for item in list_res.data]
        self.assertNotIn(self.inc_b.id, income_ids)

        # Cannot access User B's income detail
        detail_res = self.client.get(reverse("income-detail", kwargs={"pk": self.inc_b.id}))
        self.assertEqual(detail_res.status_code, status.HTTP_404_NOT_FOUND)

        # Cannot update User B's income
        patch_res = self.client.patch(
            reverse("income-detail", kwargs={"pk": self.inc_b.id}),
            {"amount": "99999.00"},
            format="json",
        )
        self.assertEqual(patch_res.status_code, status.HTTP_404_NOT_FOUND)

        # Cannot delete User B's expense
        del_res = self.client.delete(reverse("expense-detail", kwargs={"pk": self.exp_b.id}))
        self.assertEqual(del_res.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(Expense.objects.filter(id=self.exp_b.id).exists())

    def test_unified_transaction_feed(self):
        self.client.force_authenticate(user=self.user_a)
        res = self.client.get(reverse("transactions-all"))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        # Should contain User A's 1 income and 1 expense
        self.assertEqual(len(res.data), 2)
        types = [t["type"] for t in res.data]
        self.assertIn("income", types)
        self.assertIn("expense", types)
