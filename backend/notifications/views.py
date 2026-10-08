from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Notification
from .serializers import NotificationSerializer
from .services import generate_automated_notifications


class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        # Trigger automated checks for budget / goal alerts
        generate_automated_notifications(user)

        qs = Notification.objects.filter(user=user)
        unread_only = request.query_params.get("unread_only")
        if unread_only and unread_only.lower() in ["true", "1"]:
            qs = qs.filter(is_read=False)

        serializer = NotificationSerializer(qs, many=True)
        unread_count = Notification.objects.filter(user=user, is_read=False).count()

        return Response(
            {
                "unread_count": unread_count,
                "total_count": qs.count(),
                "notifications": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class NotificationDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            notif = Notification.objects.get(pk=pk, user=request.user)
        except Notification.DoesNotExist:
            return Response({"error": "Notification not found."}, status=status.HTTP_404_NOT_FOUND)

        is_read = request.data.get("is_read", True)
        notif.is_read = is_read
        notif.save()
        return Response(NotificationSerializer(notif).data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        try:
            notif = Notification.objects.get(pk=pk, user=request.user)
        except Notification.DoesNotExist:
            return Response({"error": "Notification not found."}, status=status.HTTP_404_NOT_FOUND)

        notif.delete()
        return Response({"message": "Notification deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


class MarkAllReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({"message": "All notifications marked as read."}, status=status.HTTP_200_OK)
