from django.urls import path
from .views import RegisterView, LoginView, UserProfileView, NearbyUsersView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('nearby/', NearbyUsersView.as_view(), name='nearby-users'),
]
