from django.db import models
from django.contrib.auth.models import User

class Friendship(models.Model):
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sender')
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='receiver')

    status = models.CharField(max_length=10, choices=[
        ('pending', 'pending'),
        ('accepted', 'accepted'),
        ('rejected', 'rejected')
    ], default='pending')

    created_at = models.DateTimeField(auto_now_add=True)


    class Meta:
        # un user peut etre amis qu'une seule fois avec un autre user
        unique_together = ['user1', 'user2']

        # tu peux pas etre amis avec toi meme
        constraints = [
            models.CheckConstraint(check=~models.Q(user1=models.F("user2")), name="no_self_friendship")
        ]

    def __str__(self):
        if (self.status == 'pending'):
            return f'{self.user1.username} want to be friends with {self.user2.username}'
        elif (self.status == 'accepted'):
            return f'{self.user1.username} and {self.user2.username} are friends'
        else:
            return f'{self.user1.username} rejected {self.user2.username} friend request'
