from decimal import Decimal
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from budgets.models import Budget
from goals.models import Goal
from transactions.models import Expense
from .models import Notification

User = get_user_model()


class NotificationsAPITests(APITestCase):
    def setUp(self):
        self.user_a = User.objects.create_user(username="userA", email="a@example.com", password="Pass123!A")
        self.user_b = User.objects.create_user(username="userB", email="b@example.com", password="Pass123!B")

        self.notif_a = Notification.objects.create(
            user=self.user_a,
            title="Welcome to CoinCraft",
            message="Start tracking your expenses!",
            notification_type="system",
            is_read=False,
        )

        self.notif_b = Notification.objects.create(
            user=self.user_b,
            title="User B Alert",
            message="Confidential alert",
            notification_type="system",
            is_read=False,
        )

    def test_list_and_mark_read(self):
        self.client.force_authenticate(user=self.user_a)
        res = self.client.get(reverse("notification-list"))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["unread_count"], 1)

        # Mark single as read
        patch_res = self.client.patch(
            reverse("notification-detail", kwargs={"pk": self.notif_a.id}),
            {"is_read": True},
            format="json",
        )
        self.assertEqual(patch_res.status_code, status.HTTP_200_OK)
        self.assertTrue(patch_res.data["is_read"])

    def test_mark_all_read(self):
        self.client.force_authenticate(user=self.user_a)
        res = self.client.post(reverse("notification-mark-all-read"))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(Notification.objects.filter(user=self.user_a, is_read=False).count(), 0)

    def test_user_data_isolation(self):
        self.client.force_authenticate(user=self.user_a)

        # User A cannot see User B's notification
        res = self.client.get(reverse("notification-list"))
        ids = [item["id"] for item in res.data["notifications"]]
        self.assertNotIn(self.notif_b.id, ids)

        # Cannot update User B's notification
        patch_res = self.client.patch(
            reverse("notification-detail", kwargs={"pk": self.notif_b.id}),
            {"is_read": True},
            format="json",
        )
        self.assertEqual(patch_res.status_code, status.HTTP_404_NOT_FOUND)

        # Cannot delete User B's notification
        del_res = self.client.delete(reverse("notification-detail", kwargs={"pk": self.notif_b.id}))
        self.assertEqual(del_res.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(Notification.objects.filter(id=self.notif_b.id).exists())
