import math
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

from .serializers import RegisterSerializer, LoginSerializer, UserProfileSerializer

User = get_user_model()


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
