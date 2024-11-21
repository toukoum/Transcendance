from django.db import models
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db.models.signals import post_save


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=30, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True, default="http://localhost:8000/media/avatars/default-avatar.png")
    publicKey = models.CharField(max_length=128, blank=True)

    is_2fa_enabled = models.BooleanField(default=False)
    
    #bc_public_key = models.CharField(max_length=255, blank=True)
    #is_bc_enabled = models.BooleanField(default=False)
    def __str__(self):
        return self.user.username
    
    def save(self, *args, **kwargs):
        super(Profile, self).save(*args, **kwargs)
    

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    print('create_user_profile')
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()