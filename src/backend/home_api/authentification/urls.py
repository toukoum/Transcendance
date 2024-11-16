
from django.urls import include, path

from rest_framework_simplejwt.views import TokenVerifyView
from dj_rest_auth.jwt_auth import get_refresh_view

from dj_rest_auth.registration.views import (
    ResendEmailVerificationView,
    VerifyEmailView,
)

#from dj_rest_auth.views import (
#    PasswordResetConfirmView,
#    PasswordResetView,
#)

from authentification.views import (
    email_confirm_redirect,
    password_reset_confirm_redirect,
    authorize_42, 
    oauth_callback, 
    get_user_profile,
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

    # Email verification
    path("register/verify-email/", VerifyEmailView.as_view(), name="rest_verify_email"),
    path("register/resend-email/", ResendEmailVerificationView.as_view(), name="rest_resend_email"),
    path("account-confirm-email/<str:key>/", email_confirm_redirect, name="account_confirm_email"),
    path("account-confirm-email/", VerifyEmailView.as_view(), name="account_email_verification_sent"),
    
    ## Password reset (quand on a oublié son mot de passe)
    #path("password/reset/", PasswordResetView.as_view(), name="rest_password_reset"),
    #path("password/reset/confirm/<str:uidb64>/<str:token>/", password_reset_confirm_redirect, name="password_reset_confirm"),
    #path("password/reset/confirm/", PasswordResetConfirmView.as_view(), name="password_reset_confirm"),

    # 42 OAUTH
    path("42/authorize/", authorize_42, name="42_authorize"),
    path("42/callback/", oauth_callback, name="42_callback"),
    path("42/me/", get_user_profile, name="42_get_user"),

    # 2FA
    path("2fa/", include("trench.urls")),
    path("2fa/validate/", MFAValidationViewCustom.as_view(), name="mfa_validate"),
    path("2fa/deactivate/", MFADeactivateView.as_view(), name="mfa_deactivate"),
    path("2fa/activate/", MFAActivateView.as_view(), name="mfa_activate"),

    # path("2fa/", include('trench.urls.jwt')),
]



