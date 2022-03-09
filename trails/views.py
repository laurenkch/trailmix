from django.shortcuts import render
from idna import IDNAError
from rest_framework import generics
from rest_framework import serializers

from .models import Trail, UserFeedack, Trip, TrailImage, Park, TrailImage
from .serializers import DeepTrailSerializer, ShallowTrailSerializer, TripSerializer, UserFeedbackSerializer, ImageSerializer, ParkSerializer

from rest_framework.permissions import IsAdminUser

class ParkListAdmin(generics.ListCreateAPIView):
    permission_classes=(IsAdminUser,)
    serializer_class = ParkSerializer

    queryset= Park.objects.all()


class ParkDetailAdmin(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAdminUser,)
    serializer_class = ParkSerializer

    queryset = Park.objects.all()


class TrailListAdmin(generics.ListCreateAPIView):
    serializer_class = ShallowTrailSerializer
    permission_classes = (IsAdminUser,)

    queryset = Trail.objects.all()

class TrailListUser(generics.ListAPIView):
    serializer_class = DeepTrailSerializer

    queryset=Trail.objects.all()

class TrailDetailAdmin(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DeepTrailSerializer
    permission_classes = (IsAdminUser,)

    queryset=Trail.objects.all()

class ImageList(generics.ListCreateAPIView):
    serializer_class=ImageSerializer

    queryset = TrailImage.objects.all()

class ImageList(generics.ListCreateAPIView):
    serializer_class=ImageSerializer
    queryset = TrailImage.objects.all()

class ImageTrailList(generics.ListAPIView):
    serializer_class = ImageSerializer

    def get_queryset(self):
        """
        This view should return a list of all the images for the currently selected trail
        """
        url_id = self.kwargs['trailId']
        if id is not None:
            return TrailImage.objects.filter(trail_id=url_id)
        else:
            return TrailImage.objects.all()
    
class ImageDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class=ImageSerializer

    queryset = TrailImage.objects.all()
