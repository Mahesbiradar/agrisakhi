import math
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

from .serializers import RegisterSerializer, LoginSerializer, UserProfileSerializer

User = get_user_model()


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


def _make_tokens(user):
    refresh = RefreshToken.for_user(user)
    return str(refresh.access_token), str(refresh)


def haversine_km(lat1, lng1, lat2, lng2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = (math.sin(dlat / 2) ** 2
         + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng / 2) ** 2)
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        access, refresh = _make_tokens(user)
        return Response({
            'user': UserProfileSerializer(user).data,
            'access': access,
            'refresh': refresh,
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        access, refresh = _make_tokens(user)
        return Response({
            'user': UserProfileSerializer(user).data,
            'access': access,
            'refresh': refresh,
        })


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        phone = request.data.get('phone', '').strip()
        if not phone:
            return Response({'error': 'Phone number required'}, status=400)
        try:
            User.objects.get(phone=phone)
        except User.DoesNotExist:
            pass
        return Response({'message': 'If this number is registered, you can reset your password.', 'phone': phone})


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        phone = request.data.get('phone', '').strip()
        new_password = request.data.get('new_password', '').strip()
        if not phone or not new_password:
            return Response({'error': 'Phone and new password required'}, status=400)
        if len(new_password) < 6:
            return Response({'error': 'Password must be at least 6 characters'}, status=400)
        try:
            user = User.objects.get(phone=phone)
            user.set_password(new_password)
            user.save()
            return Response({'message': 'Password reset successful. Please login.'})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)


class LocationUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        lat = request.data.get('lat')
        lng = request.data.get('lng')
        if lat and lng:
            request.user.lat = float(lat)
            request.user.lng = float(lng)
            request.user.save(update_fields=['lat', 'lng'])
        return Response({'status': 'location updated'})


class NearbyUsersView(generics.ListAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.none()

    def list(self, request, *args, **kwargs):
        role = request.query_params.get('role')
        try:
            lat = float(request.query_params.get('lat', 0))
            lng = float(request.query_params.get('lng', 0))
            radius_km = float(request.query_params.get('radius_km', 50))
        except (TypeError, ValueError):
            return Response({'error': 'Invalid lat/lng/radius_km'}, status=status.HTTP_400_BAD_REQUEST)

        qs = User.objects.filter(is_active=True)
        if role:
            qs = qs.filter(role=role)
        qs = qs.exclude(lat=None).exclude(lng=None)

        result = []
        for u in qs:
            dist = haversine_km(lat, lng, u.lat, u.lng)
            if dist <= radius_km:
                data = UserProfileSerializer(u).data
                data['distance'] = round(dist, 2)
                result.append(data)

        result.sort(key=lambda x: x['distance'])
        return Response(result)


class AdminStatsView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        from jobs.models import Job, Application
        from services.models import ServiceListing
        return Response({
            'total_users': User.objects.count(),
            'farmers': User.objects.filter(role='farmer').count(),
            'labours': User.objects.filter(role='labour').count(),
            'providers': User.objects.filter(role='provider').count(),
            'total_jobs': Job.objects.count(),
            'open_jobs': Job.objects.filter(status='open').count(),
            'total_applications': Application.objects.count(),
            'pending_applications': Application.objects.filter(status='pending').count(),
            'total_services': ServiceListing.objects.count(),
        })


class AdminUsersView(generics.ListAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        qs = User.objects.all().order_by('-created_at')
        role = self.request.query_params.get('role')
        search = self.request.query_params.get('search')
        if role:
            qs = qs.filter(role=role)
        if search:
            qs = qs.filter(name__icontains=search) | qs.filter(phone__icontains=search)
        return qs


class AdminUserToggleView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request):
        user_id = request.data.get('user_id')
        try:
            user = User.objects.get(id=user_id)
            user.is_active = not user.is_active
            user.save()
            return Response({'is_active': user.is_active})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)


class AdminPasswordResetView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request):
        user_id = request.data.get('user_id')
        new_password = request.data.get('new_password', '').strip()
        if not new_password or len(new_password) < 6:
            return Response({'error': 'Password must be at least 6 characters'}, status=400)
        try:
            user = User.objects.get(id=user_id)
            user.set_password(new_password)
            user.save()
            return Response({'message': 'Password reset successful.'})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)


class AdminJobsView(generics.ListAPIView):
    permission_classes = [IsAdmin]

    def get_queryset(self):
        from jobs.models import Job
        qs = Job.objects.select_related('farmer').order_by('-created_at')
        job_status = self.request.query_params.get('status')
        if job_status:
            qs = qs.filter(status=job_status)
        return qs

    def list(self, request, *args, **kwargs):
        from jobs.serializers import JobSerializer
        qs = self.get_queryset()
        data = JobSerializer(qs, many=True).data
        return Response(data)


class AdminJobCloseView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request):
        from jobs.models import Job
        job_id = request.data.get('job_id')
        try:
            job = Job.objects.get(id=job_id)
            job.status = 'closed'
            job.save()
            return Response({'status': 'closed'})
        except Job.DoesNotExist:
            return Response({'error': 'Job not found'}, status=404)


class AdminServicesView(generics.ListAPIView):
    permission_classes = [IsAdmin]

    def get_queryset(self):
        from services.models import ServiceListing
        return ServiceListing.objects.select_related('provider').order_by('-created_at')

    def list(self, request, *args, **kwargs):
        from services.serializers import ServiceListingSerializer
        qs = self.get_queryset()
        data = ServiceListingSerializer(qs, many=True).data
        return Response(data)
