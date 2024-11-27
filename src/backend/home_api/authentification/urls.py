
from django.urls import include, path

from rest_framework_simplejwt.views import TokenVerifyView
from dj_rest_auth.jwt_auth import get_refresh_view

from authentification.views import (
    authorize_42, 
    oauth_callback, 
    LoginViewCustom,
    MFAValidationViewCustom,
    MFADeactivateView,
    MFAActivateView,
		LogoutViewCustom,
    RegisterViewCustom,
		PasswordChangeViewCustom,
)

urlpatterns = [
    # JWT
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('token/refresh/', get_refresh_view().as_view(), name='token_refresh'),
    
    # Auth
    path("register/", RegisterViewCustom.as_view(), name="rest_register"),
    path("login/", LoginViewCustom.as_view(), name="rest_login"),
    path("logout/", LogoutViewCustom.as_view(), name="rest_logout"),

		# Password change
		path("password/change/", PasswordChangeViewCustom.as_view(), name="rest_password_change"),

    # 42 OAUTH
    path("42/authorize/", authorize_42, name="42_authorize"),
    path("42/callback/", oauth_callback, name="42_callback"),

    # 2FA
    path("2fa/", include("trench.urls")),
    path("2fa/validate/", MFAValidationViewCustom.as_view(), name="mfa_validate"),
    path("2fa/deactivate/", MFADeactivateView.as_view(), name="mfa_deactivate"),
    path("2fa/activate/", MFAActivateView.as_view(), name="mfa_activate"),

    # path("2fa/", include('trench.urls.jwt')),
]



