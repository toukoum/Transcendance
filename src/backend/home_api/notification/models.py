from django.db import models
from django.contrib.auth.models import User

class Notification(models.Model):
		user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
		user_from = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications_from', null=True, blank=True)
		event_type = models.CharField(max_length=255)
		data = models.JSONField()
		read = models.BooleanField(default=False)
		created_at = models.DateTimeField(auto_now_add=True)

		class Meta:
				ordering = ['-created_at']