from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


def health(request):
    return JsonResponse({'status': 'ok', 'message': 'AgriSakhi API is running'})

def cloudinary_test(request):
    return JsonResponse({
        "cloud_name": settings.CLOUDINARY_CLOUD_NAME,
        "api_key_exists": bool(settings.CLOUDINARY_API_KEY),
        "api_secret_exists": bool(settings.CLOUDINARY_API_SECRET),
    })


urlpatterns = [
    path('api/health/', health),
    path('admin/', admin.site.urls),
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/', include('users.urls')),
    path('api/users/', include('users.urls')),
    path('api/jobs/', include('jobs.urls')),
    path('api/services/', include('services.urls')),
    path("api/cloudinary-test/", cloudinary_test),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
