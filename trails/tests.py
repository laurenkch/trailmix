from django.test import TestCase
from .models import *
from .serializers import DeepTrailSerializer
from rest_framework import serializers
from rest_framework.test import APIClient
from django.urls import reverse
from .views import UserTrailDetail
from rest_framework import status
import json

client = APIClient()

class TrailTestCase(TestCase):
    serializer_class = DeepTrailSerializer
    def setUp(self):
        Park.objects.create(name='Test park', latitude=35.0203, longitude=35.0203, fee='$6.00',
                            hours='Sunrise to sunset', activities='hiking', address='555 Hiking Way, Greenville, SC')
        Trail.objects.create(park=Park.objects.get(id=1), name='Test trail', elevation_gain=500,
                             length=3.1, description='this is a trail for testing', trail_type='oab')

    def test_trails_automatically_generate_created_at_field(self):
        test_trail = Trail.objects.get(name='Test trail')
        self.assertTrue(test_trail.created_at)


    def test_get__a_trail(self):
        response = client.get(
            reverse('api:trails:trail_detail', kwargs={'pk': 1}))
        serializer = DeepTrailSerializer(response)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
