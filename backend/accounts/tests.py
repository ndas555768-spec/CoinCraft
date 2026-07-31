from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import User


class AuthAPITests(APITestCase):
    def test_user_can_register_and_login(self):
        register_url = reverse("register")
        login_url = reverse("login")

        payload = {
            "username": "alice",
            "email": "alice@example.com",
            "password": "Secret123!",
        }

        register_response = self.client.post(register_url, payload, format="json")
        self.assertEqual(register_response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email="alice@example.com").exists())

        login_response = self.client.post(login_url, {"email": "alice@example.com", "password": "Secret123!"}, format="json")
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn("access", login_response.data)
        self.assertIn("refresh", login_response.data)

    def test_login_with_wrong_password_fails(self):
        User.objects.create_user(
            username="bob",
            email="bob@example.com",
            password="ValidPassword123!",
        )

        response = self.client.post(
            reverse("login"),
            {"email": "bob@example.com", "password": "WrongPassword"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
