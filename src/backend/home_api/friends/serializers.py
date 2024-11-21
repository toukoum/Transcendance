
from friends.models import Friendship
from rest_framework import serializers

from django.contrib.auth.models import User

class FriendshipSerializer(serializers.ModelSerializer):
    """
		To get all the friends of the authenticated user
		"""

    user1 = serializers.SlugRelatedField(
						queryset=User.objects.all(),
						slug_field='username'
					)
    # all users but not the authenticated user
    user2 = serializers.SlugRelatedField(
            queryset=User.objects.all(),
            slug_field='username'
        )

    status = serializers.CharField(read_only=True)
    class Meta:
        model = Friendship
        fields = ['id', 'user1', 'user2', 'status', 'created_at']

    def create(self, validated_data):
        return Friendship.objects.create(**validated_data)
    

class DetailFriendshipSerializer(serializers.ModelSerializer):

    user1 = serializers.PrimaryKeyRelatedField(read_only=True)
    user2 = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Friendship
        fields = ['id', 'user1', 'user2', 'status', 'created_at']