import math
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError

from .models import ServiceListing, Rating
from .serializers import ServiceListingSerializer, RatingSerializer


def haversine_km(lat1, lng1, lat2, lng2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = (math.sin(dlat / 2) ** 2
         + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng / 2) ** 2)
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def _filter_by_location(qs, lat, lng, radius_km):
    result = []
    for obj in qs:
        dist = haversine_km(lat, lng, obj.lat, obj.lng)
        if dist <= radius_km:
            obj.distance = round(dist, 2)
            result.append(obj)
    result.sort(key=lambda x: x.distance)
    return result


class ServiceListCreateView(generics.ListCreateAPIView):
    serializer_class = ServiceListingSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def list(self, request, *args, **kwargs):
        params = request.query_params
        try:
            lat = float(params.get('lat', 0))
            lng = float(params.get('lng', 0))
            radius_km = float(params.get('radius_km', 60))
        except (TypeError, ValueError):
            lat = lng = 0
            radius_km = 60

        category = params.get('category')

        qs = ServiceListing.objects.select_related('provider')
        if category:
            qs = qs.filter(category=category)

        if params.get('lat') and params.get('lng'):
            result = []
            for obj in qs:
                dist = haversine_km(lat, lng, obj.lat, obj.lng)
                if dist <= obj.coverage_km:
                    obj.distance = round(dist, 1)
                    result.append(obj)
            result.sort(key=lambda x: x.distance)
            services = result
        else:
            services = list(qs)

        serializer = self.get_serializer(services, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        if request.user.role != 'provider':
            raise PermissionDenied('Only providers can create service listings.')
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(
            provider=user,
            lat=user.lat or 0.0,
            lng=user.lng or 0.0,
            village=user.village,
            district=user.district,
        )


class ServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ServiceListing.objects.select_related('provider')
    serializer_class = ServiceListingSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)
        if request.method in ('PUT', 'PATCH', 'DELETE') and obj.provider != request.user:
            raise PermissionDenied('You do not own this service listing.')


class ProviderServicesView(generics.ListAPIView):
    serializer_class = ServiceListingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ServiceListing.objects.filter(provider=self.request.user).select_related('provider')


class RatingCreateView(generics.CreateAPIView):
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        from jobs.models import Job, Application
        user = self.request.user
        job_id = self.request.data.get('job')
        try:
            job = Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            raise ValidationError('Job not found.')
        if Rating.objects.filter(job=job, rater=user).exists():
            raise ValidationError('You have already rated this job.')
        involved = (
            job.farmer_id == user.id or
            Application.objects.filter(job=job, labour=user).exists()
        )
        if not involved:
            raise ValidationError('You were not involved in this job.')
        serializer.save(rater=user)
