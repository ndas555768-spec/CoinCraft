from decimal import Decimal
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from accounts.models import User
from transactions.models import Income, Expense
from budgets.models import Budget
from goals.models import Goal
from notifications.models import Notification


class EndToEndUserJourneyTests(APITestCase):
    def test_complete_finance_journey(self):
        # 1. Register account
        reg_payload = {
            "username": "nandita_investor",
            "email": "nandita@example.com",
            "password": "WealthPassword2026!",
            "confirm_password": "WealthPassword2026!",
        }
        reg_res = self.client.post(reverse("register"), reg_payload, format="json")
        self.assertEqual(reg_res.status_code, status.HTTP_201_CREATED)
        self.assertIn("access", reg_res.data)
        self.assertIn("user", reg_res.data)

        # 2. Login
        login_payload = {
            "email": "nandita@example.com",
            "password": "WealthPassword2026!",
        }
        login_res = self.client.post(reverse("login"), login_payload, format="json")
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)
        access_token = login_res.data["access"]
        refresh_token = login_res.data["refresh"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

        # 3. Open dashboard (initial state: 0 balance)
        dash_res1 = self.client.get(reverse("dashboard"))
        self.assertEqual(dash_res1.status_code, status.HTTP_200_OK)
        self.assertEqual(Decimal(dash_res1.data["summary"]["balance"]), Decimal("0.00"))

        # 4. Add income
        inc_payload = {
            "source": "Salary",
            "category": "Salary",
            "amount": "75000.00",
            "date": "2026-10-01",
            "description": "Monthly pay",
        }
        inc_res = self.client.post(reverse("income-list-create"), inc_payload, format="json")
        self.assertEqual(inc_res.status_code, status.HTTP_201_CREATED)

        # Verify dashboard updates with income
        dash_res2 = self.client.get(reverse("dashboard"))
        self.assertEqual(Decimal(dash_res2.data["summary"]["total_income"]), Decimal("75000.00"))
        self.assertEqual(Decimal(dash_res2.data["summary"]["balance"]), Decimal("75000.00"))

        # 5. Add expense
        exp_payload = {
            "title": "Grocery Superstore",
            "category": "Food",
            "amount": "12000.00",
            "payment_method": "UPI",
            "date": "2026-10-02",
            "description": "Monthly pantry groceries",
        }
        exp_res = self.client.post(reverse("expense-list-create"), exp_payload, format="json")
        self.assertEqual(exp_res.status_code, status.HTTP_201_CREATED)

        # Verify balance updates: 75000 - 12000 = 63000
        dash_res3 = self.client.get(reverse("dashboard"))
        self.assertEqual(Decimal(dash_res3.data["summary"]["total_expense"]), Decimal("12000.00"))
        self.assertEqual(Decimal(dash_res3.data["summary"]["balance"]), Decimal("63000.00"))

        # 6. Create budget for Food in current month
        budget_payload = {
            "category": "Food",
            "amount": "15000.00",
            "month": 10,
            "year": 2026,
        }
        budget_res = self.client.post(reverse("budget-list-create"), budget_payload, format="json")
        self.assertEqual(budget_res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Decimal(budget_res.data["spent"]), Decimal("12000.00"))
        self.assertEqual(Decimal(budget_res.data["remaining"]), Decimal("3000.00"))
        self.assertEqual(budget_res.data["status"], "warning")  # 12k/15k = 80% used

        # Add second expense to exceed budget
        exp2_payload = {
            "title": "Dinner Restaurant",
            "category": "Food",
            "amount": "4000.00",
            "payment_method": "Card",
            "date": "2026-10-03",
        }
        self.client.post(reverse("expense-list-create"), exp2_payload, format="json")

        # Verify budget now reports exceeded
        budget_list = self.client.get(reverse("budget-list-create"))
        food_b = [b for b in budget_list.data if b["category"] == "Food"][0]
        self.assertEqual(Decimal(food_b["spent"]), Decimal("16000.00"))
        self.assertEqual(food_b["status"], "exceeded")

        # 7. Create savings goal
        goal_payload = {
            "title": "Emergency Fund Jar",
            "target_amount": "50000.00",
            "saved_amount": "10000.00",
            "target_date": "2027-06-30",
        }
        goal_res = self.client.post(reverse("goal-list-create"), goal_payload, format="json")
        self.assertEqual(goal_res.status_code, status.HTTP_201_CREATED)
        goal_id = goal_res.data["id"]

        # Update savings goal (deposit more funds)
        goal_patch = self.client.patch(
            reverse("goal-detail", kwargs={"pk": goal_id}),
            {"saved_amount": "50000.00"},
            format="json",
        )
        self.assertEqual(goal_patch.status_code, status.HTTP_200_OK)
        self.assertEqual(goal_patch.data["status"], "completed")

        # 8. Check Notifications (system generated budget warnings & completed goal)
        notif_res = self.client.get(reverse("notification-list"))
        self.assertEqual(notif_res.status_code, status.HTTP_200_OK)
        self.assertTrue(len(notif_res.data["notifications"]) > 0)
        titles = [n["title"] for n in notif_res.data["notifications"]]
        self.assertTrue(any("Budget" in t for t in titles))
        self.assertTrue(any("Goal" in t for t in titles))

        # 9. Profile management
        prof_res = self.client.get(reverse("profile"))
        self.assertEqual(prof_res.status_code, status.HTTP_200_OK)
        self.assertEqual(prof_res.data["username"], "nandita_investor")

        prof_update = self.client.patch(
            reverse("profile"),
            {"currency": "INR", "dark_mode": True},
            format="json",
        )
        self.assertEqual(prof_update.status_code, status.HTTP_200_OK)
        self.assertTrue(prof_update.data["dark_mode"])

        # 10. Logout
        logout_res = self.client.post(reverse("logout"), {"refresh": refresh_token}, format="json")
        self.assertEqual(logout_res.status_code, status.HTTP_200_OK)

        # 11. Clear auth credentials & verify protected routes reject unauthenticated access
        self.client.credentials()  # cleared
        protected_endpoints = [
            reverse("dashboard"),
            reverse("income-list-create"),
            reverse("expense-list-create"),
            reverse("budget-list-create"),
            reverse("goal-list-create"),
            reverse("notification-list"),
            reverse("profile"),
        ]
        for ep in protected_endpoints:
            unauth_res = self.client.get(ep)
            self.assertEqual(
                unauth_res.status_code,
                status.HTTP_401_UNAUTHORIZED,
                f"Endpoint {ep} should require authentication",
            )

        # 12. Login again & verify data persists
        relogin_res = self.client.post(reverse("login"), login_payload, format="json")
        self.assertEqual(relogin_res.status_code, status.HTTP_200_OK)
        new_token = relogin_res.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {new_token}")

        # Check that data persisted
        persisted_dash = self.client.get(reverse("dashboard"))
        self.assertEqual(Decimal(persisted_dash.data["summary"]["total_income"]), Decimal("75000.00"))
        self.assertEqual(Decimal(persisted_dash.data["summary"]["total_expense"]), Decimal("16000.00"))
        self.assertEqual(Decimal(persisted_dash.data["summary"]["balance"]), Decimal("59000.00"))
        self.assertEqual(Decimal(persisted_dash.data["summary"]["total_savings"]), Decimal("50000.00"))
