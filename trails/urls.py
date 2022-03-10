from django.urls import path, include

from .views import ParkListAdmin, TrailListAdmin, ImageList, TrailDetailAdmin, ParkDetailAdmin, ImageDetail, ImageTrailList, TrailListUser, ParkListUser, TrailDetailUser, ParkDetailUser, UserFeedback

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

    path('', TrailListUser.as_view(), name='trails'),
    path('parks/', ParkListUser.as_view(), name='parks'),
    path('<int:pk>/', TrailDetailUser.as_view(), name='trail_detail'),
    path('park/<int:pk>/', ParkDetailUser.as_view(), name='park_detail'),

    path('feedback/', UserFeedback.as_view(), name='trail_feedback'),
]
