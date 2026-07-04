from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(unique=True)
    profile_picture = models.ImageField(
        upload_to="profiles/",
        blank=True,
        null=True
    )

    currency = models.CharField(
        max_length=10,
        default="INR"
    )

    dark_mode = models.BooleanField(
        default=False
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email
    