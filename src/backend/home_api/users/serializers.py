

from rest_framework import serializers
from django.contrib.auth.models import User
from users.models import Profile
from rest_framework_simplejwt.tokens import AccessToken

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['bio', 'location', 'avatar', 'is_2fa_enabled']

class UserDetailSerializer(serializers.ModelSerializer):
    
    profile = ProfileSerializer()
    session = serializers.SerializerMethodField()
    jwt = serializers.SerializerMethodField()  
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'profile', 'session', 'jwt']

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if profile_data:
            print('profile_data', profile_data)
            profile = instance.profile
            for attr, value in profile_data.items():
                setattr(profile, attr, value)
            profile.save()
        
        return instance
    
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
        

class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active']