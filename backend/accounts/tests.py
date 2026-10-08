from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import User


class AccountsAPITests(APITestCase):
    def test_registration_success(self):
        url = reverse("register")
        payload = {
            "username": "alice",
            "email": "alice@example.com",
            "password": "Password123!",
            "confirm_password": "Password123!",
        }
        res = self.client.post(url, payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email="alice@example.com").exists())
        self.assertIn("access", res.data)
        self.assertIn("user", res.data)

    def test_registration_duplicate_email_fails(self):
        User.objects.create_user(username="u1", email="taken@example.com", password="Password123!")
        url = reverse("register")
        res = self.client.post(url, {
            "username": "u2",
            "email": "taken@example.com",
            "password": "Password123!",
        }, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_registration_password_mismatch_fails(self):
        url = reverse("register")
        res = self.client.post(url, {
            "username": "alice2",
            "email": "alice2@example.com",
            "password": "Password123!",
            "confirm_password": "DifferentPassword123!",
        }, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_success_and_profile_retrieval_and_update(self):
        user = User.objects.create_user(
            username="bob",
            email="bob@example.com",
            password="BobPassword123!",
            currency="USD",
        )
        login_url = reverse("login")
        login_res = self.client.post(login_url, {
            "email": "bob@example.com",
            "password": "BobPassword123!",
        }, format="json")
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)
        access_token = login_res.data["access"]
        refresh_token = login_res.data["refresh"]

        # View Profile
        profile_url = reverse("profile")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")
        prof_res = self.client.get(profile_url)
        self.assertEqual(prof_res.status_code, status.HTTP_200_OK)
        self.assertEqual(prof_res.data["email"], "bob@example.com")
        self.assertEqual(prof_res.data["currency"], "USD")

        # Update Profile
        update_res = self.client.patch(profile_url, {"currency": "EUR", "dark_mode": True}, format="json")
        self.assertEqual(update_res.status_code, status.HTTP_200_OK)
        self.assertEqual(update_res.data["currency"], "EUR")
        self.assertTrue(update_res.data["dark_mode"])

        # Logout
        logout_url = reverse("logout")
        logout_res = self.client.post(logout_url, {"refresh": refresh_token}, format="json")
        self.assertEqual(logout_res.status_code, status.HTTP_200_OK)
