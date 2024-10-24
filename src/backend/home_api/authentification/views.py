
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
        return redirect('http://localhost:5500/account.html')
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
