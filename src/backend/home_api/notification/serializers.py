
from rest_framework import serializers
from notification.models import Notification

class NotificationListSerializer(serializers.ModelSerializer):
		class Meta:
				model = Notification
				fields = ('id', 'event_type', 'user', 'user_from', 'data', 'isRead', 'created_at', 'action')
				read_only_fields = ('id', 'event_type', 'user', 'user_from', 'data', 'isRead', 'created_at', 'action')
												
		