from django.shortcuts import render
from rest_framework import generics

from .models import Trail, UserFeedack, Trip, TrailImage, Park, TrailImage
from .serializers import TrailSerializer, TripSerializer, UserFeedbackSerializer, ImageSerializer, ParkSerializer

from rest_framework.permissions import IsAdminUser

class ParkListAdmin(generics.ListCreateAPIView):
    permission_classes=(IsAdminUser,)
    serializer_class = ParkSerializer

    queryset= Park.objects.all()


class TrailListAdmin(generics.ListCreateAPIView):
    serializer_class = TrailSerializer
    permission_classes = (IsAdminUser,)

    queryset = Trail.objects.all()

class TrailListUser(generics.ListAPIView):
    serializer_class = TrailSerializer

    queryset=Trail.objects.all()

class TrailDetailAdmin(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TrailSerializer
    permission_classes = (IsAdminUser,)

    queryset=Trail.objects.all()

class ImageList(generics.ListCreateAPIView):
    serializer_class=ImageSerializer

    queryset = TrailImage.objects.all()
    
class ImageDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class=ImageSerializer

    queryset = TrailImage.objects.all()
