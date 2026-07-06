from django.db import models
from django.conf import settings


class Income(models.Model):

    CATEGORY_CHOICES = [
        ("Salary", "Salary"),
        ("Freelance", "Freelance"),
        ("Business", "Business"),
        ("Investment", "Investment"),
        ("Gift", "Gift"),
        ("Other", "Other"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="incomes",
    )

    source = models.CharField(
        max_length=100,
    )

    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    date = models.DateField()

    description = models.TextField(
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return f"{self.user.email} - {self.source} - ₹{self.amount}"
