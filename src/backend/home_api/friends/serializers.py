
from friends.models import Friendship
from rest_framework import serializers

from django.contrib.auth.models import User

from users.models import Profile
from django.contrib.auth.models import User

from django.conf import settings

class FriendshipSerializer(serializers.ModelSerializer):
    """
    To get all the friends of the authenticated user
    """

    user1 = serializers.SlugRelatedField(
        queryset=User.objects.all(),
        slug_field='username',
        required=False
    )
    user2 = serializers.SlugRelatedField(
        queryset=User.objects.all(),
        slug_field='username'
    )

    user1_avatar = serializers.SerializerMethodField()
    user2_avatar = serializers.SerializerMethodField()
    
    is_online_user1 = serializers.SerializerMethodField()
    is_online_user2 = serializers.SerializerMethodField()

    status = serializers.CharField(read_only=True)

    class Meta:
        model = Friendship
        fields = ['id', 'user1', 'user2', 'status', 'created_at', 'user1_avatar', 'user2_avatar', 'is_online_user1', 'is_online_user2']

    def create(self, validated_data):
        return Friendship.objects.create(**validated_data)

    def get_user1_avatar(self, obj):
      request = self.context.get('request')
      if obj.user1.profile.avatar:
          return request.build_absolute_uri(obj.user1.profile.avatar.url)
      return None

    def get_user2_avatar(self, obj):
        request = self.context.get('request')
        if obj.user2.profile.avatar:
            return request.build_absolute_uri(obj.user2.profile.avatar.url)
        return None
        
    def get_is_online_user1(self, obj):
        try:
            return obj.user1.profile.is_online
        except Profile.DoesNotExist:
            return False
    
    def get_is_online_user2(self, obj):
        try:
            return obj.user2.profile.is_online
        except Profile.DoesNotExist:
            return False
    

class DetailFriendshipSerializer(serializers.ModelSerializer):

    user1 = serializers.PrimaryKeyRelatedField(read_only=True)
    user2 = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Friendship
        fields = ['id', 'user1', 'user2', 'status', 'created_at']