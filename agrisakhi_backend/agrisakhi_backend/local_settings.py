from pathlib import Path

from .settings import *  # noqa

BASE_DIR = Path(__file__).resolve().parent.parent

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
STORAGES['default'] = {
    'BACKEND': 'django.core.files.storage.FileSystemStorage',
}

INSTALLED_APPS = [
    app for app in INSTALLED_APPS
    if app not in ('cloudinary', 'cloudinary_storage')
]
