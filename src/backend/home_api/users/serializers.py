

from rest_framework import serializers
from django.contrib.auth.models import User
from users.models import Profile
from rest_framework_simplejwt.tokens import AccessToken

class ProfileSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(read_only=True)
    class Meta:
        model = Profile
        fields = ['bio', 'location', 'avatar', 'is_2fa_enabled', 'publicKey', 'is_online']

class UserSelfSerializer(serializers.ModelSerializer):
    """
        For the endpoint /me/, private endpoint
    """
    
    profile = ProfileSerializer(required=False)
    session = serializers.SerializerMethodField()
    jwt = serializers.SerializerMethodField()
    is_active = serializers.BooleanField(read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'profile', 'session', 'jwt']

    
    def update(self, instance, validated_data):
      profile_data = validated_data.pop('profile', None)

      for attr, value in validated_data.items():
          setattr(instance, attr, value)
      instance.save()

      if profile_data:
          print("Profile data", profile_data)
          profile = instance.profile
          for attr, value in profile_data.items():
              setattr(profile, attr, value)
          profile.save()

      return instance
    
    def validate_email(self, value):
        if self.instance.email != value:
            if User.objects.filter(email=value).exists():
                raise serializers.ValidationError("This email is already in use.")
        return value
    
    def get_session(self, obj):
        request = self.context.get('request')
        session_data = {}

        session_data['session_key'] = request.session.session_key
        session_data['created_at'] = request.session.get('created_at')
        session_data['expiry'] = request.session.get_expiry_date()

        return session_data

    def get_jwt(self, obj):
        request = self.context.get('request')
        jwt_data = {}

        jwt_data['transcendence-token'] = request.COOKIES.get('transcendence-token')  # Utiliser COOKIES ici
        jwt_data['transcendence-refresh-token'] = request.COOKIES.get('transcendence-refresh-token')  # Utiliser COOKIES ici

        return jwt_data
        
class UserWrapperSerializer(serializers.Serializer):
    user = UserSelfSerializer(source='*')



class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        

class UserSearchSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    friend_status = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'friend_status', 'profile', 'first_name', 'last_name']

    def get_friend_status(self, obj):
        from friends.models import Friendship
        from django.db.models import Q
        
        request = self.context.get('request', None)
        if request is None:
            return None

        current_user = request.user
        
        friendship = Friendship.objects.filter(
            Q(user1=current_user, user2=obj) |
            Q(user1=obj, user2=current_user)
        ).first()

        if friendship:
            return friendship.status
        return 'no_relation'
        
        
        
class UserDetailSerializer(serializers.ModelSerializer):
    """
        Public route to get user info and matches
    """
    matches = serializers.SerializerMethodField()
    profile = ProfileSerializer()
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'matches', 'profile', 'date_joined', 'last_login', 'is_active']
        
    def get_matches(self, obj):
        from games.models import Match
        from games.serializers import MatchSerializer
        matches = Match.objects.filter(match_players__user=obj.id)
        return MatchSerializer(matches, many=True).data


class ProfileAvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['avatar']

    def update(self, instance, validated_data):
        print("Validated data", validated_data)
        instance.avatar = validated_data.get('avatar', instance.avatar)
        instance.save()
        return instance