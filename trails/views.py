from django.shortcuts import render
from rest_framework import generics
from rest_framework import serializers
from rest_framework.decorators import api_view
import json
from rest_framework.response import Response
from rest_framework import status
from .models import Trail, UserFeedback, Trip, TrailImage, Park, TrailImage
from .serializers import DeepTrailSerializer, ShallowTrailSerializer, TripShallowSerializer, UserFeedbackSerializer, ImageSerializer, ParkCreateSerializer, ParkViewSerializer, TripDeepSerializer

from rest_framework.permissions import IsAdminUser

class ParkListAdmin(generics.ListCreateAPIView):
    permission_classes=(IsAdminUser,)
    serializer_class = ParkCreateSerializer

    queryset = Park.objects.order_by('name')


class ParkDetailAdmin(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAdminUser,)
    serializer_class = ParkViewSerializer

    queryset = Park.objects.all()


class TrailListAdmin(generics.ListCreateAPIView):
    serializer_class = ShallowTrailSerializer
    permission_classes = (IsAdminUser,)

    queryset = Trail.objects.order_by('name')


class TrailDetailAdmin(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DeepTrailSerializer
    permission_classes = (IsAdminUser,)

    queryset=Trail.objects.all()


class UserTrailList(generics.ListAPIView):
    serializer_class = ShallowTrailSerializer

    queryset = Trail.objects.order_by('name')


class UserTrailDetail(generics.RetrieveAPIView):
    serializer_class = DeepTrailSerializer
    queryset = Trail.objects.all()


class UserParkList(generics.ListAPIView):
    serializer_class = ParkViewSerializer

    queryset = Park.objects.order_by('name')

class UserParkDetail(generics.RetrieveAPIView):
    serializer_class = ParkViewSerializer
    queryset = Park.objects.all()


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

class UserFeedback(generics.CreateAPIView):
    serializer_class=UserFeedbackSerializer
    queryset= UserFeedback.objects.all()


class TripList(generics.ListCreateAPIView):
    serializer_class = TripShallowSerializer

    def get_queryset(self):
        """
        filters list to return trips associated with the current user
        """
        queryset = Trip.objects.filter(user=self.request.user).order_by('date')

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# class MostRecentTripDetail(generics.ListAPIView):
#     serializer_class = TripShallowSerializer


#     def get_queryset(self):

#         """
#         returns most recent trip to a trail
#         """
#         queryset = Trip.objects.filter(user=self.request.user)
#         trailID = self.request.query_params.get('trail', None)
#         if trailID is not None:
#             queryset = Trip.objects.filter(trail=trailID)
#             queryset.order_by('date')[:1]

#         return queryset

# recent_trail.order_by('date')[:1]

# @ api_view(('GET',))
# def mostRecentTripDetail(request):
#     dump_data = json.dumps(request.data)
#     load_data = json.loads(dump_data)
#     recent_trail = Trip.objects.filter(user=request.user)
#     trailId = load_data['trail']
#     trips = Trip.objects.filter(trail=trailId)
#     serializer = TripDeepSerializer
#     if trips:
#         trip = trips.order_by('date')[:1]
#         if serializer.is_valid():
#             return_data = serializer.save(trip)
#             return Response(return_data, status=status.HTTP_200_OK)
#     else: 
#         return None



# @ api_view(('POST',))
# def PostListByUserView(request):
#     post_dump_data = json.dumps(request.data)
#     post_data = json.loads(post_dump_data)
#     user = post_data['user']
#     post_list = Post.objects.filter(user=user)
#     return response.Response(post_list)


# 1: 47

class TripDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TripDeepSerializer

    def get_queryset(self):
        """
        filters list to return trips associated with the current user
        """
        queryset = Trip.objects.filter(user=self.request.user)

        return queryset
