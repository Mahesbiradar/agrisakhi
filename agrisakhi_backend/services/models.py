import uuid
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from jobs.models import Job

CATEGORY_CHOICES = [
    ('machinery', 'Machinery'),
    ('chemical', 'Chemical'),
    ('seeds', 'Seeds'),
    ('testing', 'Testing'),
    ('other', 'Other'),
]


class ServiceListing(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    provider = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='services'
    )
    service_name = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True)
    image_url = models.URLField(blank=True)
    price_info = models.CharField(max_length=200)
    village = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    lat = models.FloatField()
    lng = models.FloatField()
    coverage_km = models.IntegerField(default=50, choices=[(10, '10 km'), (25, '25 km'), (50, '50 km'), (100, '100 km')])
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.service_name


class Rating(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    rater = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ratings_given'
    )
    ratee = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ratings_received'
    )
    stars = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['job', 'rater']

    def __str__(self):
        return f'{self.rater} rated {self.ratee} {self.stars}*'
