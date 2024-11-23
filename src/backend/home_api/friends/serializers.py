
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

    status = serializers.CharField(read_only=True)

    class Meta:
        model = Friendship
        fields = ['id', 'user1', 'user2', 'status', 'created_at', 'user1_avatar', 'user2_avatar']

    def create(self, validated_data):
        return Friendship.objects.create(**validated_data)

    def get_user1_avatar(self, obj):
        request = self.context.get('request')
        try:
            avatar = obj.user1.profile.avatar
            if not str(avatar).startswith('http'):
                return request.build_absolute_uri(avatar.url)
            else:
                return settings.DEFAULT_AVATAR
        except Profile.DoesNotExist:
            return None

    def get_user2_avatar(self, obj):
        request = self.context.get('request')
        try:
            avatar = obj.user2.profile.avatar
            if not str(avatar).startswith('http'):
                return request.build_absolute_uri(avatar.url)
            else:
                return settings.DEFAULT_AVATAR
        except Profile.DoesNotExist:
            return None
    

class DetailFriendshipSerializer(serializers.ModelSerializer):

    user1 = serializers.PrimaryKeyRelatedField(read_only=True)
    user2 = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Friendship
        fields = ['id', 'user1', 'user2', 'status', 'created_at']