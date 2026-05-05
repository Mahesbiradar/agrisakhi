from django.urls import path
from .views import (
    JobListCreateView, JobDetailView, FarmerJobsView,
    ApplicationCreateView, ApplicationListView, ApplicationUpdateView,
)

urlpatterns = [
    path('', JobListCreateView.as_view(), name='job-list-create'),
    path('my/', FarmerJobsView.as_view(), name='farmer-jobs'),
    path('<uuid:pk>/', JobDetailView.as_view(), name='job-detail'),
    path('<uuid:job_id>/apply/', ApplicationCreateView.as_view(), name='job-apply'),
    path('<uuid:job_id>/applications/', ApplicationListView.as_view(), name='job-applications'),
    path('applications/<uuid:pk>/', ApplicationUpdateView.as_view(), name='application-update'),
]
