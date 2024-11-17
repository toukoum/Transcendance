from django.db import models
from django.contrib.auth.models import User

class Notification(models.Model):
		event_type = models.CharField(max_length=255)
		user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
		user_from = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications_from', null=True, blank=True)
		data = models.JSONField()
		isRead = models.BooleanField(default=False)
		created_at = models.DateTimeField(auto_now_add=True)
		action = models.JSONField(null=True, blank=True)

		class Meta:
				ordering = ['-created_at']
		
		def __str__(self):
				return f'{self.user.username} - {self.event_type}'