import uuid
from django.db import models
from django.conf import settings

WORK_TYPE_CHOICES = [
    ('harvesting', 'Harvesting'),
    ('planting', 'Planting'),
    ('irrigation', 'Irrigation'),
    ('spraying', 'Spraying'),
    ('land_prep', 'Land Preparation'),
    ('other', 'Other'),
]

JOB_STATUS_CHOICES = [
    ('open', 'Open'),
    ('closed', 'Closed'),
]

APPLICATION_STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('accepted', 'Accepted'),
    ('rejected', 'Rejected'),
]


class Job(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    farmer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posted_jobs'
    )
    title = models.CharField(max_length=200)
    work_type = models.CharField(max_length=20, choices=WORK_TYPE_CHOICES)
    description = models.TextField(blank=True)
    audio_url = models.URLField(blank=True)
    image_url = models.URLField(blank=True)
    wage_per_day = models.IntegerField()
    duration_days = models.IntegerField()
    workers_needed = models.IntegerField(default=1)
    village = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    lat = models.FloatField()
    lng = models.FloatField()
    status = models.CharField(max_length=10, choices=JOB_STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Application(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    labour = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='applications'
    )
    status = models.CharField(max_length=10, choices=APPLICATION_STATUS_CHOICES, default='pending')
    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['job', 'labour']

    def __str__(self):
        return f'{self.labour} -> {self.job}'
