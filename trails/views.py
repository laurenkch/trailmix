from django.shortcuts import render
from rest_framework import generics

from .models import Trail, UserFeedack, Trip, TrailImage
from .serializers import TrailSerializer, TripSerializer, UserFeedbackSerializer, TrailImageSerializer

from rest_framework.permissions import IsAdminUser

class TrailListAdmin(generics.ListCreateAPIView):
    serializer_class = TrailSerializer
    permission_classes = IsAdminUser

    queryset = Trail.objects.all()

class TrailListUser(generics.ListAPIView):
    serializer_class = TrailSerializer

    queryset=Trail.objects.all()

class TrailDetailAdmin(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TrailSerializer
    permission_classes = IsAdminUser

    queryset=Trail.objects.all()



