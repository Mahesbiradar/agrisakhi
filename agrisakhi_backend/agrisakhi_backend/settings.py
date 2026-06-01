from pathlib import Path
from datetime import timedelta
from importlib.util import find_spec
from urllib.parse import parse_qsl, unquote, urlparse
import os

from django.core.exceptions import ImproperlyConfigured
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / '.env', override=True)


def env_bool(name, default=False):
    value = os.environ.get(name)
    if value is None:
        return default
    return value.strip().lower() in {'1', 'true', 'yes', 'on'}


def env_int(name, default):
    value = os.environ.get(name)
    if value in (None, ''):
        return default
    try:
        return int(value)
    except ValueError as exc:
        raise ImproperlyConfigured(f'{name} must be an integer.') from exc


def csv_env(name):
    return [item.strip() for item in os.environ.get(name, '').split(',') if item.strip()]


def unique(items):
    result = []
    for item in items:
        if item and item not in result:
            result.append(item)
    return result


DEBUG = env_bool('DEBUG', True)
IS_PRODUCTION = (
    env_bool('DJANGO_PRODUCTION', False)
    or bool(os.environ.get('RAILWAY_ENVIRONMENT'))
    or not DEBUG
)

SECRET_KEY = os.environ.get('SECRET_KEY', '')
if IS_PRODUCTION and not SECRET_KEY:
    raise ImproperlyConfigured('SECRET_KEY must be set in production.')
if not SECRET_KEY:
    SECRET_KEY = 'django-insecure-local-development-only-change-me'

LOCAL_ALLOWED_HOSTS = ['localhost', '127.0.0.1', '[::1]', 'testserver']
PRODUCTION_ALLOWED_HOSTS = ['.railway.app', '.up.railway.app', '.vercel.app']
ALLOWED_HOSTS = unique(
    csv_env('ALLOWED_HOSTS')
    + LOCAL_ALLOWED_HOSTS
    + (PRODUCTION_ALLOWED_HOSTS if IS_PRODUCTION else [])
)

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'cloudinary',
    'cloudinary_storage',
    'users',
    'jobs',
    'services',
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

if find_spec('whitenoise'):
    MIDDLEWARE.insert(2, 'whitenoise.middleware.WhiteNoiseMiddleware')

ROOT_URLCONF = 'agrisakhi_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
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

WSGI_APPLICATION = 'agrisakhi_backend.wsgi.application'


def postgres_database_from_url(database_url):
    parsed = urlparse(database_url)
    if parsed.scheme not in {'postgres', 'postgresql'}:
        raise ImproperlyConfigured('DATABASE_URL must use postgres:// or postgresql://.')

    database_name = unquote(parsed.path.lstrip('/'))
    if not database_name:
        raise ImproperlyConfigured('DATABASE_URL must include a database name.')

    config = {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': database_name,
        'USER': unquote(parsed.username or ''),
        'PASSWORD': unquote(parsed.password or ''),
        'HOST': parsed.hostname or '',
        'PORT': str(parsed.port or ''),
        'CONN_MAX_AGE': env_int('DB_CONN_MAX_AGE', 600),
    }
    options = dict(parse_qsl(parsed.query))
    if options:
        config['OPTIONS'] = options
    return config


def postgres_database_from_env():
    required = ['DB_NAME', 'DB_USER', 'DB_HOST']
    missing = [key for key in required if not os.environ.get(key)]
    if missing:
        raise ImproperlyConfigured(
            'PostgreSQL configuration is missing: ' + ', '.join(missing)
        )
    return {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ['DB_NAME'],
        'USER': os.environ['DB_USER'],
        'PASSWORD': os.environ.get('DB_PASSWORD', ''),
        'HOST': os.environ['DB_HOST'],
        'PORT': os.environ.get('DB_PORT', '5432'),
        'CONN_MAX_AGE': env_int('DB_CONN_MAX_AGE', 600),
    }


DATABASE_URL = os.environ.get('DATABASE_URL', '')
USE_POSTGRES = IS_PRODUCTION or env_bool('USE_POSTGRES', False)

if USE_POSTGRES:
    DATABASES = {
        'default': (
            postgres_database_from_url(DATABASE_URL)
            if DATABASE_URL
            else postgres_database_from_env()
        )
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Kolkata'

USE_I18N = True

USE_TZ = True

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'users.User'

LOCAL_CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:5177',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175',
    'http://127.0.0.1:5176',
    'http://127.0.0.1:5177',
    'http://127.0.0.1:8000',
]
CORS_ALLOWED_ORIGINS = unique(
    csv_env('CORS_ALLOWED_ORIGINS')
    + csv_env('CORS_ORIGINS')
    + LOCAL_CORS_ALLOWED_ORIGINS
)
CORS_ALLOWED_ORIGIN_REGEXES = unique(
    csv_env('CORS_ALLOWED_ORIGIN_REGEXES')
    + ([
        r'^https://.*\.vercel\.app$',
        r'^https://.*\.railway\.app$',
        r'^https://.*\.up\.railway\.app$',
    ] if IS_PRODUCTION else [])
)
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    'accept', 'accept-encoding', 'authorization',
    'content-type', 'dnt', 'origin', 'user-agent',
    'x-csrftoken', 'x-requested-with',
]

LOCAL_CSRF_TRUSTED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
]
PRODUCTION_CSRF_TRUSTED_ORIGINS = [
    'https://*.railway.app',
    'https://*.up.railway.app',
    'https://*.vercel.app',
]
CSRF_TRUSTED_ORIGINS = unique(
    csv_env('CSRF_TRUSTED_ORIGINS')
    + LOCAL_CSRF_TRUSTED_ORIGINS
    + (PRODUCTION_CSRF_TRUSTED_ORIGINS if IS_PRODUCTION else [])
)

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SESSION_COOKIE_SECURE = IS_PRODUCTION
CSRF_COOKIE_SECURE = IS_PRODUCTION
SECURE_SSL_REDIRECT = env_bool('SECURE_SSL_REDIRECT', False)
SECURE_HSTS_SECONDS = env_int('SECURE_HSTS_SECONDS', 0 if not IS_PRODUCTION else 3600)
SECURE_HSTS_INCLUDE_SUBDOMAINS = env_bool('SECURE_HSTS_INCLUDE_SUBDOMAINS', IS_PRODUCTION)
SECURE_HSTS_PRELOAD = env_bool('SECURE_HSTS_PRELOAD', False)

# DRF
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),
}

# JWT
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=env_int('JWT_ACCESS_TOKEN_MINUTES', 15)),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=env_int('JWT_REFRESH_TOKEN_DAYS', 7)),
    'ROTATE_REFRESH_TOKENS': env_bool('JWT_ROTATE_REFRESH_TOKENS', True),
    'ALGORITHM': os.environ.get('JWT_ALGORITHM', 'HS256'),
    'SIGNING_KEY': os.environ.get('JWT_SIGNING_KEY', SECRET_KEY),
}

CLOUDINARY_CLOUD_NAME = os.environ.get('CLOUDINARY_CLOUD_NAME', '')
CLOUDINARY_API_KEY = os.environ.get('CLOUDINARY_API_KEY', '')
CLOUDINARY_API_SECRET = os.environ.get('CLOUDINARY_API_SECRET', '')

if CLOUDINARY_CLOUD_NAME and CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET:
    import cloudinary
    cloudinary.config(
        cloud_name=CLOUDINARY_CLOUD_NAME,
        api_key=CLOUDINARY_API_KEY,
        api_secret=CLOUDINARY_API_SECRET,
    )
    CLOUDINARY_STORAGE = {
        'CLOUD_NAME': CLOUDINARY_CLOUD_NAME,
        'API_KEY': CLOUDINARY_API_KEY,
        'API_SECRET': CLOUDINARY_API_SECRET,
    }
    STORAGES = {
        'default': {
            'BACKEND': 'cloudinary_storage.storage.MediaCloudinaryStorage',
        },
        'staticfiles': {
            'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage',
        },
    }
else:
    STORAGES = {
        'default': {
            'BACKEND': 'django.core.files.storage.FileSystemStorage',
        },
        'staticfiles': {
            'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage',
        },
    }

if find_spec('whitenoise'):
    STORAGES['staticfiles'] = {
        'BACKEND': 'whitenoise.storage.CompressedManifestStaticFilesStorage',
    }
