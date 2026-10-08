from decimal import Decimal
from django.db.models import Sum
from django.utils import timezone

from budgets.models import Budget
from goals.models import Goal
from transactions.models import Expense
from .models import Notification


def generate_automated_notifications(user):
    """
    Checks the user's current month budgets and goals, generating timely notifications
    without spamming duplicate active alerts.
    """
    now = timezone.now()
    current_year = now.year
    current_month = now.month

    # 1. Evaluate Budgets
    budgets = Budget.objects.filter(user=user, year=current_year, month=current_month)
    for b in budgets:
        spent = (
            Expense.objects.filter(
                user=user,
                category=b.category,
                date__year=current_year,
                date__month=current_month,
            ).aggregate(total=Sum("amount"))["total"]
            or Decimal("0.00")
        )

        if b.amount > Decimal("0.00"):
            percent = (spent / b.amount) * Decimal("100")
            if spent > b.amount:
                title = f"Budget Exceeded: {b.category}"
                message = f"You have exceeded your {b.category} budget of {b.amount}. Current spending: {spent}."
                if not Notification.objects.filter(user=user, title=title, is_read=False).exists():
                    Notification.objects.create(
                        user=user,
                        title=title,
                        message=message,
                        notification_type="budget_exceeded",
                    )
            elif percent >= Decimal("80.0"):
                title = f"Budget Warning: {b.category}"
                message = f"Your {b.category} budget is {round(float(percent))}% used ({spent} of {b.amount})."
                if not Notification.objects.filter(user=user, title=title, is_read=False).exists():
                    Notification.objects.create(
                        user=user,
                        title=title,
                        message=message,
                        notification_type="budget_warning",
                    )

    # 2. Evaluate Goals
    goals = Goal.objects.filter(user=user)
    for g in goals:
        if g.target_amount > Decimal("0.00"):
            percent = (g.saved_amount / g.target_amount) * Decimal("100")
            if g.saved_amount >= g.target_amount:
                title = f"Goal Completed: {g.title}"
                message = f"Congratulations! You reached your savings goal '{g.title}' of {g.target_amount}!"
                if not Notification.objects.filter(user=user, title=title).exists():
                    Notification.objects.create(
                        user=user,
                        title=title,
                        message=message,
                        notification_type="goal_completed",
                    )
            elif percent >= Decimal("75.0"):
                title = f"Goal Progress: {g.title}"
                message = f"You're {round(float(percent))}% toward your '{g.title}' savings goal."
                if not Notification.objects.filter(user=user, title=title, is_read=False).exists():
                    Notification.objects.create(
                        user=user,
                        title=title,
                        message=message,
                        notification_type="goal_progress",
                    )
