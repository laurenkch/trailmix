from django.urls import path, include

from .views import *


# ParkListAdmin, TrailListAdmin, ImageList, TrailDetailAdmin, ParkDetailAdmin, ImageDetail, ImageTrailList, UserTrailList, UserParkList, UserTrailDetail, UserParkDetail, UserFeedback, UserTrailList, TripList, TripDetail,

app_name = 'trails'

urlpatterns = [

    # admin urls with editing permissions

    path('admin/parks/', ParkListAdmin.as_view(), name='admin_parks'),
    path('admin/', TrailListAdmin.as_view(), name='admin_trails'),
    path('photos/', ImageList.as_view(), name='image_list'),
    path('photos/trailId/<int:trailId>/', ImageTrailList.as_view(), name='image_trail_list'),
    path('photos/<int:pk>/', ImageDetail.as_view(), name='image_detail'),
    path('edit/park/<int:pk>/', ParkDetailAdmin.as_view(), name='edit_park'),
    path('edit/<int:pk>/', TrailDetailAdmin.as_view(), name='edit_trail'),

    #read only urls for trail info

    path('', UserTrailList.as_view(), name='trails'),
    path('parks/', UserParkList.as_view(), name='parks'),
    path('park/<int:pk>/', UserParkDetail.as_view(), name='park'),
    path('<int:pk>/', UserTrailDetail.as_view(), name='trail_detail'),

    #user urls
    path('feedback/', UserFeedback.as_view(), name='trail_feedback'),
    path('trips/', TripList.as_view(), name='trips'),
    path('trip/<int:pk>/', TripDetail.as_view(), name='trip_detail'),
    # path('trip/recent/', mostRecentTripDetail, name='recent_trip')
]
