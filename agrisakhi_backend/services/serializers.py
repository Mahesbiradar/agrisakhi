from rest_framework import serializers
from .models import ServiceListing, Rating


class ServiceListingSerializer(serializers.ModelSerializer):
    provider_name = serializers.SerializerMethodField()
    distance = serializers.SerializerMethodField()

    class Meta:
        model = ServiceListing
        fields = [
            'id', 'provider', 'provider_name', 'service_name', 'category',
            'description', 'image_url', 'price_info', 'village', 'district',
            'lat', 'lng', 'coverage_km', 'is_available', 'created_at', 'distance',
        ]
        read_only_fields = ['id', 'provider', 'created_at']
        extra_kwargs = {
            'lat': {'required': False},
            'lng': {'required': False},
            'village': {'required': False, 'default': ''},
            'district': {'required': False, 'default': ''},
        }

    def get_provider_name(self, obj):
        return obj.provider.name

    def get_distance(self, obj):
        return getattr(obj, 'distance', None)


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['id', 'job', 'rater', 'ratee', 'stars', 'comment', 'created_at']
        read_only_fields = ['id', 'rater', 'created_at']
