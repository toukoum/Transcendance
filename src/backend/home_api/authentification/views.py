
from django.conf import settings
from django.http import HttpResponseRedirect

import requests
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from django.shortcuts import redirect
import random, string

from rest_framework.decorators import api_view


# 2FA =================================================================================================
from dj_rest_auth.registration.views import LoginView
from django.conf import settings  
from trench.utils import get_mfa_model, user_token_generator
from trench import serializers
from rest_framework.response import Response

from dj_rest_auth.jwt_auth import set_jwt_cookies
from dj_rest_auth.serializers import JWTSerializer
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.settings import api_settings as jwt_settings
from django.utils import timezone
from django.contrib.auth import login as django_login
from dj_rest_auth.app_settings import api_settings
from dj_rest_auth.utils import jwt_encode
from rest_framework.status import HTTP_401_UNAUTHORIZED
from trench.serializers import CodeLoginSerializer
from rest_framework.request import Request
from trench.command.authenticate_second_factor import authenticate_second_step_command
from trench.exceptions import MFAValidationError
from trench.responses import ErrorResponse
#=======================================================================================================



# ==============================
# ===== MAIL VERIF =============
# ==============================


def email_confirm_redirect(request, key):
    return HttpResponseRedirect(
        f"{settings.EMAIL_CONFIRM_REDIRECT_BASE_URL}{key}/"
    )

def password_reset_confirm_redirect(request, uidb64, token):
    return HttpResponseRedirect(
        f"{settings.PASSWORD_RESET_CONFIRM_REDIRECT_BASE_URL}{uidb64}/{token}/"
    )


# ==============================
# ===== OAUTH 42 ===============
# ==============================


def generate_state():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=32))

def authorize_42(request):
    state = generate_state()
    request.session['oauth_state'] = state
    authorize_url = (
        "https://api.intra.42.fr/oauth/authorize?"
        f"client_id={settings.CLIENT_ID}&"
        f"redirect_uri={settings.REDIRECT_URI}&"
        "response_type=code&"
        "scope=public&"
        f"state={state}"
    )
    return redirect(authorize_url)

@api_view(['GET'])
def oauth_callback(request):
    code = request.GET.get('code')
    state = request.GET.get('state')


    if state != request.session.get('oauth_state'):
        return Response({"detail": "Invalid state"}, status=status.HTTP_400_BAD_REQUEST)
    
    token_url = "https://api.intra.42.fr/oauth/token"

    data = {
        "grant_type": "authorization_code",
        "client_id": settings.CLIENT_ID,
        "client_secret": settings.CLIENT_SECRET,
        "code": code,
        "redirect_uri": settings.REDIRECT_URI,
    }

    response = requests.post(token_url, data=data)

    if response.status_code == 200:
        token_info = response.json()
        access_token = token_info.get('access_token')
        request.session['access_token'] = access_token
        return Response({"detail": "Successfully logged in with 42"}, status=status.HTTP_200_OK)
    else:
        return Response({"detail": "Invalid code"}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
def get_user_profile(request):
    access_token = request.session.get('access_token')
    if not access_token:
        return redirect('42_authorize')

    headers = {'Authorization': f'Bearer {access_token}'}
    profile_url = "https://api.intra.42.fr/v2/me"
    response = requests.get(profile_url, headers=headers)
    
    if response.status_code == 200:
        user_profile = response.json()
        return Response(user_profile)
    else:
        return Response({"detail": "Error retrieving user profile"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==============================
# =========== 2FA ==============
# ==============================

MFAMethod = get_mfa_model()

class LoginViewCustom(LoginView):
    authentication_classes = ()

    def handle_mfa_response(self, user, mfa_method):
        data = {
            'ephemeral_token': user_token_generator.make_token(user),
            'method': mfa_method.name,
            'other_methods': serializers.UserMFAMethodSerializer(
                user.mfa_methods.filter(is_active=True, is_primary=False),
                many=True,
            ).data,
        }
        return Response(data)

    def post(self, request, *args, **kwargs):
        self.request = request
        self.serializer = self.get_serializer(data=request.data)
        self.serializer.is_valid(raise_exception=True)
        user = self.serializer.validated_data.get("user")        

        print("=====> Voici l'user: " + user.username)
        if hasattr(user, 'profile') and user.profile.is_2fa_enabled:
            auth_method = (
                user.mfa_methods
                    .filter(is_primary=True, is_active=True)
                    .first()
            )
            print("Méthodes MFA de l'utilisateur:", user.mfa_methods.all())

            if auth_method:
                print("===> Le 2fa est activé pour cet utilisateur yo")
                conf = settings.TRENCH_AUTH["MFA_METHODS"][auth_method.name]
                handler_class = conf['HANDLER']

                handler = handler_class(
                    mfa_method=auth_method,
                    config=conf
                )
                handler.dispatch_message()
                return self.handle_mfa_response(user, auth_method)
            else:
                print("===> Le 2fa n'est pas activé pour cet utilisateur yo")
        self.login()
        return self.get_response()
    



class MFAValidationViewCustom(APIView):
    """
    Vue pour valider le code MFA et finaliser la connexion de l'utilisateur.
    """

    permission_classes = (AllowAny,)
    def post(self, request: Request) -> Response:
        serializer = CodeLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = authenticate_second_step_command(
                code=serializer.validated_data["code"],
                ephemeral_token=serializer.validated_data["ephemeral_token"],
            )
            
            if (user and user.is_authenticated):
                print("WTFFFFFF Le user est bien authentifié en 2FA!")

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
            response = Response(serializer.data, status=status.HTTP_200_OK)

            set_jwt_cookies(response, access_token, refresh_token)
            
            return response


        except MFAValidationError as cause:
            return ErrorResponse(error=cause, status=HTTP_401_UNAUTHORIZED)


class MFADeactivateView(APIView):
    """
    Vue pour désactiver la double authentification de l'utilisateur.
    """

    permission_classes = (IsAuthenticated,)
    def post(self, request: Request) -> Response:
        user = request.user
        user.profile.is_2fa_enabled = False
        user.profile.save()
        return Response(status=status.HTTP_204_NO_CONTENT)




