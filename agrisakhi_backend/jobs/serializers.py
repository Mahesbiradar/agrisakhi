from rest_framework import serializers
from .models import Job, Application


class JobSerializer(serializers.ModelSerializer):
    farmer_name = serializers.SerializerMethodField()
    distance = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            'id', 'farmer', 'farmer_name', 'title', 'work_type', 'description',
            'audio_url', 'image_url', 'wage_per_day', 'duration_days', 'workers_needed',
            'village', 'district', 'lat', 'lng', 'status', 'created_at', 'distance',
        ]
        read_only_fields = ['id', 'farmer', 'created_at']
        extra_kwargs = {
            'lat': {'required': False},
            'lng': {'required': False},
            'village': {'required': False, 'default': ''},
            'district': {'required': False, 'default': ''},
        }

    def get_farmer_name(self, obj):
        return obj.farmer.name

    def get_distance(self, obj):
        return getattr(obj, 'distance', None)


class ApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    labour_name = serializers.CharField(source='labour.name', read_only=True)

    class Meta:
        model = Application
        fields = ['id', 'job', 'job_title', 'labour', 'labour_name', 'status', 'applied_at']
        read_only_fields = ['id', 'labour', 'applied_at']
        extra_kwargs = {
            'job': {'required': False},
        }
