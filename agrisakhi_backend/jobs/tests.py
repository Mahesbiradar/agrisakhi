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


FARMER_DATA = {
    'name': 'Raju Farmer', 'phone': '9100000001', 'password': 'pass1234',
    'role': 'farmer', 'village': 'Hubli', 'district': 'Dharwad',
    'lat': 14.2, 'lng': 75.9,
}
LABOUR_DATA = {
    'name': 'Shiva Labour', 'phone': '9100000002', 'password': 'pass1234',
    'role': 'labour', 'village': 'Gadag', 'district': 'Gadag',
    'lat': 14.3, 'lng': 75.8,
}
JOB_PAYLOAD = {
    'title': 'Harvest wheat',
    'work_type': 'harvesting',
    'wage_per_day': 400,
    'duration_days': 5,
    'workers_needed': 2,
}


class JobTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.farmer_token = _register_and_login(self.client, FARMER_DATA)
        self.labour_token = _register_and_login(self.client, LABOUR_DATA)

    def _auth(self, token):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)

    def _create_job(self):
        self._auth(self.farmer_token)
        resp = self.client.post('/api/jobs/', JOB_PAYLOAD, format='json')
        return resp

    def test_create_job_as_farmer(self):
        resp = self._create_job()
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data['title'], 'Harvest wheat')

    def test_create_job_as_labour(self):
        self._auth(self.labour_token)
        resp = self.client.post('/api/jobs/', JOB_PAYLOAD, format='json')
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_jobs_with_location(self):
        self._create_job()
        self.client.credentials()
        resp = self.client.get('/api/jobs/?lat=14.2&lng=75.9&radius_km=100')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIsInstance(resp.data, list)

    def test_apply_to_job(self):
        job_resp = self._create_job()
        job_id = job_resp.data['id']
        self._auth(self.labour_token)
        resp = self.client.post(f'/api/jobs/{job_id}/apply/', {}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

    def test_apply_twice(self):
        job_resp = self._create_job()
        job_id = job_resp.data['id']
        self._auth(self.labour_token)
        self.client.post(f'/api/jobs/{job_id}/apply/', {}, format='json')
        resp = self.client.post(f'/api/jobs/{job_id}/apply/', {}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
