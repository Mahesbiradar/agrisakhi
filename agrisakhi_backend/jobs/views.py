import math
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError
from django.contrib.auth import get_user_model

from .models import Job, Application
from .serializers import JobSerializer, ApplicationSerializer

User = get_user_model()


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
            obj.distanceKm = round(dist, 1)
            result.append(obj)
    result.sort(key=lambda x: x.distanceKm)
    return result


class JobListCreateView(generics.ListCreateAPIView):
    serializer_class = JobSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def list(self, request, *args, **kwargs):
        params = request.query_params
        try:
            lat = float(params.get('lat', 0))
            lng = float(params.get('lng', 0))
            radius_km = float(params.get('radius_km', 50))
        except (TypeError, ValueError):
            lat = lng = 0
            radius_km = 50

        work_type = params.get('work_type')
        min_wage = params.get('min_wage')
        district = params.get('district')

        qs = Job.objects.select_related('farmer')
        if work_type:
            qs = qs.filter(work_type=work_type)
        if district:
            qs = qs.filter(district__iexact=district)
        if min_wage:
            try:
                qs = qs.filter(wage_per_day__gte=int(min_wage))
            except ValueError:
                pass

        if params.get('lat') and params.get('lng'):
            jobs = _filter_by_location(qs, lat, lng, radius_km)
        else:
            jobs = list(qs)

        serializer = self.get_serializer(jobs, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        if request.user.role != 'farmer':
            raise PermissionDenied('Only farmers can post jobs.')
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(
            farmer=user,
            lat=user.lat or 0.0,
            lng=user.lng or 0.0,
            village=user.village,
            district=user.district,
        )


class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.select_related('farmer')
    serializer_class = JobSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)
        if request.method in ('PUT', 'PATCH', 'DELETE') and obj.farmer != request.user:
            raise PermissionDenied('You do not own this job.')


class FarmerJobsView(generics.ListAPIView):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Job.objects.filter(farmer=self.request.user).select_related('farmer')


class ApplicationCreateView(generics.CreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        if user.role != 'labour':
            raise PermissionDenied('Only labour users can apply to jobs.')
        job_id = self.kwargs['job_id']
        try:
            job = Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            raise ValidationError('Job not found.')
        if job.status != 'open':
            raise ValidationError('This job is no longer open.')
        if Application.objects.filter(job=job, labour=user).exists():
            raise ValidationError('You have already applied to this job.')
        serializer.save(labour=user, job=job)


class ApplicationListView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        job_id = self.kwargs['job_id']
        if user.role == 'farmer':
            return Application.objects.filter(job__id=job_id, job__farmer=user)
        return Application.objects.filter(job__id=job_id, labour=user)


class ApplicationUpdateView(generics.UpdateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]
    queryset = Application.objects.all()

    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)
        if obj.job.farmer != request.user:
            raise PermissionDenied('Only the job owner can update applications.')


class JobCloseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            job = Job.objects.get(pk=pk, farmer=request.user)
        except Job.DoesNotExist:
            return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)
        job.status = 'closed'
        job.close_reason = request.data.get('reason', '')
        job.close_remark = request.data.get('remark', '')
        job.save()
        return Response({'status': 'closed', 'message': 'Job closed successfully'})
