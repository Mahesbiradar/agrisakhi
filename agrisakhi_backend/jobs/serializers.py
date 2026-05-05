from rest_framework import serializers
from .models import Job, Application


class JobSerializer(serializers.ModelSerializer):
    farmer_name = serializers.SerializerMethodField()
    farmer_phone = serializers.SerializerMethodField()
    distanceKm = serializers.SerializerMethodField()
    applications_count = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            'id', 'farmer', 'farmer_name', 'farmer_phone', 'title', 'work_type', 'description',
            'audio_url', 'image_url', 'wage_per_day', 'duration_days', 'workers_needed',
            'village', 'district', 'lat', 'lng', 'status', 'close_reason', 'close_remark',
            'created_at', 'distanceKm', 'applications_count',
        ]
        read_only_fields = ['id', 'farmer', 'created_at']
        extra_kwargs = {
            'lat': {'required': False},
            'lng': {'required': False},
            'village': {'required': False, 'default': ''},
            'district': {'required': False, 'default': ''},
            'close_reason': {'required': False},
            'close_remark': {'required': False},
        }

    def get_farmer_name(self, obj):
        return obj.farmer.name

    def get_farmer_phone(self, obj):
        return obj.farmer.phone

    def get_distanceKm(self, obj):
        return getattr(obj, 'distanceKm', None)

    def get_applications_count(self, obj):
        return obj.applications.count()


class ApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    labour_name = serializers.CharField(source='labour.name', read_only=True)
    labour_phone = serializers.CharField(source='labour.phone', read_only=True)
    labour_village = serializers.CharField(source='labour.village', read_only=True)

    class Meta:
        model = Application
        fields = [
            'id', 'job', 'job_title', 'labour', 'labour_name',
            'labour_phone', 'labour_village', 'status', 'applied_at',
        ]
        read_only_fields = ['id', 'labour', 'applied_at']
        extra_kwargs = {
            'job': {'required': False},
        }
