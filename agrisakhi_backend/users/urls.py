from django.urls import path
from .views import (
    RegisterView, LoginView, UserProfileView, NearbyUsersView,
    ForgotPasswordView, ResetPasswordView,
    AdminStatsView, AdminUsersView, AdminUserToggleView, AdminPasswordResetView,
    AdminJobsView, AdminJobCloseView, AdminServicesView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('nearby/', NearbyUsersView.as_view(), name='nearby-users'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    path('admin/stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('admin/users/', AdminUsersView.as_view(), name='admin-users'),
    path('admin/users/toggle/', AdminUserToggleView.as_view(), name='admin-user-toggle'),
    path('admin/users/reset-password/', AdminPasswordResetView.as_view(), name='admin-user-reset-password'),
    path('admin/jobs/', AdminJobsView.as_view(), name='admin-jobs'),
    path('admin/jobs/close/', AdminJobCloseView.as_view(), name='admin-job-close'),
    path('admin/services/', AdminServicesView.as_view(), name='admin-services'),
]
