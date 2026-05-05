import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class UserManager(BaseUserManager):
    def create_user(self, phone, name, role, password=None, **extra):
        if not phone:
            raise ValueError('Phone number is required')
        user = self.model(phone=phone, name=name, role=role, **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone, name, role='farmer', password=None, **extra):
        extra.setdefault('is_staff', True)
        return self.create_user(phone, name, role, password, **extra)


ROLE_CHOICES = [
    ('farmer', 'Farmer'),
    ('labour', 'Labour'),
    ('provider', 'Provider'),
    ('admin', 'Admin'),
]


class User(AbstractBaseUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15, unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    village = models.CharField(max_length=100, blank=True, null=True)
    district = models.CharField(max_length=100, blank=True, null=True)
    lat = models.FloatField(null=True, blank=True)
    lng = models.FloatField(null=True, blank=True)
    avatar_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = ['name', 'role']

    def __str__(self):
        return f'{self.name} ({self.phone})'
