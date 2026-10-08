from decimal import Decimal
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Goal

User = get_user_model()


class GoalsAPITests(APITestCase):
    def setUp(self):
        self.user_a = User.objects.create_user(username="userA", email="a@example.com", password="Pass123!A")
        self.user_b = User.objects.create_user(username="userB", email="b@example.com", password="Pass123!B")

        self.goal_a = Goal.objects.create(
            user=self.user_a,
            title="Emergency Fund",
            target_amount=Decimal("100000.00"),
            saved_amount=Decimal("75000.00"),
            target_date="2027-12-31",
        )

        self.goal_b = Goal.objects.create(
            user=self.user_b,
            title="Vacation",
            target_amount=Decimal("50000.00"),
            saved_amount=Decimal("50000.00"),
            target_date="2027-06-30",
        )

    def test_goal_calculations_and_status(self):
        self.client.force_authenticate(user=self.user_a)
        res = self.client.get(reverse("goal-list-create"))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)

        g = res.data[0]
        self.assertEqual(Decimal(g["remaining_amount"]), Decimal("25000.00"))
        self.assertEqual(g["percentage_completed"], 75.0)
        self.assertEqual(g["status"], "in_progress")

    def test_goal_completion(self):
        self.client.force_authenticate(user=self.user_a)
        patch_res = self.client.patch(
            reverse("goal-detail", kwargs={"pk": self.goal_a.id}),
            {"saved_amount": "100000.00"},
            format="json",
        )
        self.assertEqual(patch_res.status_code, status.HTTP_200_OK)
        self.assertEqual(patch_res.data["status"], "completed")
        self.assertEqual(patch_res.data["percentage_completed"], 100.0)

    def test_user_data_isolation(self):
        self.client.force_authenticate(user=self.user_a)

        # Cannot see User B's goal
        res = self.client.get(reverse("goal-list-create"))
        ids = [item["id"] for item in res.data]
        self.assertNotIn(self.goal_b.id, ids)

        # Cannot edit or delete User B's goal
        del_res = self.client.delete(reverse("goal-detail", kwargs={"pk": self.goal_b.id}))
        self.assertEqual(del_res.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(Goal.objects.filter(id=self.goal_b.id).exists())
