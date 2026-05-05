from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

FARMER_DATA = {
    'name': 'Raju Farmer',
    'phone': '9000000001',
    'password': 'pass1234',
    'role': 'farmer',
    'village': 'Hubli',
    'district': 'Dharwad',
    'lat': 14.2,
    'lng': 75.9,
}

LABOUR_DATA = {
    'name': 'Shiva Labour',
    'phone': '9000000002',
    'password': 'pass1234',
    'role': 'labour',
    'village': 'Gadag',
    'district': 'Gadag',
    'lat': 14.3,
    'lng': 75.8,
}

PROVIDER_DATA = {
    'name': 'Meena Provider',
    'phone': '9000000003',
    'password': 'pass1234',
    'role': 'provider',
    'village': 'Dharwad',
    'district': 'Dharwad',
    'lat': 14.1,
    'lng': 75.7,
}


class AuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_farmer(self):
        resp = self.client.post('/api/auth/register/', FARMER_DATA, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', resp.data)
        self.assertEqual(resp.data['user']['role'], 'farmer')

    def test_register_duplicate_phone(self):
        self.client.post('/api/auth/register/', FARMER_DATA, format='json')
        resp = self.client.post('/api/auth/register/', FARMER_DATA, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_success(self):
        self.client.post('/api/auth/register/', FARMER_DATA, format='json')
        resp = self.client.post('/api/auth/login/', {
            'phone': FARMER_DATA['phone'],
            'password': FARMER_DATA['password'],
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn('access', resp.data)
        self.assertIn('refresh', resp.data)

    def test_login_wrong_password(self):
        self.client.post('/api/auth/register/', FARMER_DATA, format='json')
        resp = self.client.post('/api/auth/login/', {
            'phone': FARMER_DATA['phone'],
            'password': 'wrongpassword',
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_nearby_labour(self):
        self.client.post('/api/auth/register/', FARMER_DATA, format='json')
        self.client.post('/api/auth/register/', LABOUR_DATA, format='json')
        login = self.client.post('/api/auth/login/', {
            'phone': FARMER_DATA['phone'],
            'password': FARMER_DATA['password'],
        }, format='json')
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + login.data['access'])
        resp = self.client.get('/api/users/nearby/?role=labour&lat=14.2&lng=75.9')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIsInstance(resp.data, list)
        if resp.data:
            self.assertIn('distance', resp.data[0])
