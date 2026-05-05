from .settings import *  # noqa
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Override Cloudinary — use local filesystem for dev
DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Remove cloudinary from installed apps for local dev
INSTALLED_APPS = [app for app in INSTALLED_APPS
                  if app not in ('cloudinary', 'cloudinary_storage')]
