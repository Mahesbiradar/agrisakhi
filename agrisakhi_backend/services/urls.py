from django.urls import path
from .views import ServiceListCreateView, ServiceDetailView, ProviderServicesView, RatingCreateView

urlpatterns = [
    path('', ServiceListCreateView.as_view(), name='service-list-create'),
    path('my/', ProviderServicesView.as_view(), name='provider-services'),
    path('<uuid:pk>/', ServiceDetailView.as_view(), name='service-detail'),
    path('ratings/', RatingCreateView.as_view(), name='rating-create'),
]
