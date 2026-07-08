from django.db import models

# Create your models here.
from django.conf import settings
from django.db import models


class Goal(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="goals",
    )

    title = models.CharField(
        max_length=100,
    )

    target_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    saved_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
    )

    target_date = models.DateField()

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return self.title