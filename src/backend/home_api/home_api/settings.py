"""
Django settings for home_api project.

Generated by 'django-admin startproject' using Django 5.1.2.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

from datetime import timedelta
import os
from pathlib import Path
import logging


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

WSGI_APPLICATION = 'home_api.wsgi.application'

#logging.basicConfig(level=logging.DEBUG)

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG_DJANGO', default=True)

ALLOWED_HOSTS = ['*']

# Application definition
INSTALLED_APPS = [
    'daphne',

    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'dj_rest_auth',

    'trench',

    "django.contrib.sites",
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'authentification',
    'users',
    'friends',
    'chat',
		'notification',
		'games',
		
    'rest_framework',
    'rest_framework.authtoken',


    'anymail',

    'corsheaders', 

    'channels',

    
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


ROOT_URLCONF = 'home_api.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
		'NAME': os.environ.get('POSTGRES_DB'),
        'USER': os.environ.get('POSTGRES_USER'),
        'PASSWORD': os.environ.get('POSTGRES_PASSWORD'),
        'HOST': os.environ.get('POSTGRES_HOST'),
        'PORT': os.environ.get('POSTGRES_PORT'),
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/


# All Auth ==================================================


AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
)

# A changer pour que ca marche !
ACCOUNT_AUTHENTICATION_METHOD = "username_email"
ACCOUNT_EMAIL_REQUIRED = True

ACCOUNT_EMAIL_VERIFICATION = "none"


# Redirect for email confirmation
EMAIL_CONFIRM_REDIRECT_BASE_URL = "http://localhost:5500/email/confirm/"
PASSWORD_RESET_CONFIRM_REDIRECT_BASE_URL = "http://localhost:5500/password-reset/confirm/"
# ==================================================


STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'dj_rest_auth.jwt_auth.JWTCookieAuthentication',
    ],
}


REST_AUTH = {
    'USE_JWT': True,
    'JWT_AUTH_COOKIE': 'transcendence-token',
    'JWT_AUTH_REFRESH_COOKIE': 'transcendence-refresh-token',
    'JWT_AUTH_SECURE': False,  # Permet d'envoyer les cookies sans HTTPS (dev uniquement)
    'JWT_AUTH_SAMESITE': 'Lax',  # Permet d'envoyer les cookies cross-site
    'JWT_AUTH_HTTPONLY': True,  # Empêche JavaScript d'accéder aux cookies
}

REST_USE_JWT = True

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1000),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}

SITE_ID = 1


# MAILGUN ==================================================
ANYMAIL = {
    "MAILGUN_API_KEY": os.environ.get('MAILGUN_API_KEY', default=''),
    "MAILGUN_SENDER_DOMAIN": os.environ.get('MAILGUN_SENDER_DOMAIN', default=''),
}


EMAIL_BACKEND = "anymail.backends.mailgun.EmailBackend"
DEFAULT_FROM_EMAIL = "raphaelgiraud12@gmail.com"
SERVER_EMAIL = "toukoumcode@gmail.com"




# =========================================================

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = True

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5500"
]

CLIENT_ID = os.environ.get('CLIENT_ID', default='')
CLIENT_SECRET = os.environ.get('CLIENT_SECRET', default='')
REDIRECT_URI = os.environ.get('REDIRECT_URI', default='')


MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')


# TRENCH ==================================================

TRENCH_AUTH = {
    "DEFAULT_VALIDITY_PERIOD": 30,
    "MFA_METHODS": {
        'email': {
            "HANDLER": "trench.backends.basic_mail.SendMailMessageDispatcher",
            'VERBOSE_NAME': 'email',
            'SOURCE_FIELD': 'email',
            "VALIDITY_PERIOD": 60 * 10,
            'EMAIL_SUBJECT': 'Your verification code',
            'EMAIL_PLAIN_TEMPLATE': "templates/email/mfa_code.txt",
            'EMAIL_HTML_TEMPLATE': "templates/email/mfa_code.html",
        },
        "app": {
            "VERBOSE_NAME": "app",
            "VALIDITY_PERIOD": 60 * 10,
            "USES_THIRD_PARTY_CLIENT": True,
            "HANDLER": "trench.backends.application.ApplicationMessageDispatcher",
        }
    }
}


# Channels ==================================================

ASGI_APPLICATION = "home_api.asgi.application"

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("redis", 6379)],
        },
    },
}