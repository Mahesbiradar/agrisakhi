from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()


def _register_and_login(client, data):
    client.post('/api/auth/register/', data, format='json')
    resp = client.post('/api/auth/login/', {
        'phone': data['phone'], 'password': data['password']
    }, format='json')
    return resp.data['access']


PROVIDER_DATA = {
    'name': 'Meena Provider', 'phone': '9200000003', 'password': 'pass1234',
    'role': 'provider', 'village': 'Dharwad', 'district': 'Dharwad',
    'lat': 14.1, 'lng': 75.7,
}
SERVICE_PAYLOAD = {
    'service_name': 'Tractor Rental',
    'category': 'machinery',
    'price_info': '1500/day',
}


class ServiceTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.provider_token = _register_and_login(self.client, PROVIDER_DATA)

    def _auth(self, token):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)

    def test_create_service_as_provider(self):
        self._auth(self.provider_token)
        resp = self.client.post('/api/services/', SERVICE_PAYLOAD, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data['service_name'], 'Tractor Rental')

    def test_list_services_with_location(self):
        self._auth(self.provider_token)
        self.client.post('/api/services/', SERVICE_PAYLOAD, format='json')
        self.client.credentials()
        resp = self.client.get('/api/services/?lat=14.2&lng=75.9')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIsInstance(resp.data, list)
