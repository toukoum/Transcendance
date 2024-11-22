
from django.utils import timezone
from dj_rest_auth.jwt_auth import set_jwt_cookies
from dj_rest_auth.utils import jwt_encode
from dj_rest_auth.app_settings import api_settings
from dj_rest_auth.serializers import JWTSerializer
from rest_framework_simplejwt.settings import api_settings as jwt_settings
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login as django_login

def format_response(data=None, error=None, status=200):
    return Response({
        "data": data,
        "error": error
    }, status=status)


def sent_custom_JWT(request, user):
    """
        To Set JWT cookies in the user browser
    """

    access_token, refresh_token = jwt_encode(user)

    if api_settings.SESSION_LOGIN:
        django_login(request, user)

    response_data = {
        "user": user,
        "access": access_token,
        "refresh": refresh_token,
    }

    if api_settings.JWT_AUTH_RETURN_EXPIRATION:
        response_data["access_expiration"] = timezone.now() + jwt_settings.ACCESS_TOKEN_LIFETIME
        response_data["refresh_expiration"] = timezone.now() + jwt_settings.REFRESH_TOKEN_LIFETIME

    serializer = JWTSerializer(instance=response_data, context={"request": request})
    
    formatted_response = format_response(
        status=status.HTTP_200_OK,
        data=serializer.data,
    )

    # Ajouter les cookies JWT à la réponse
    set_jwt_cookies(formatted_response, access_token, refresh_token)

    return formatted_response
