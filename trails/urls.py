from django.urls import path, include

from .views import ParkListAdmin, TrailListAdmin, ImageList, TrailDetailAdmin, ParkDetailAdmin

app_name = 'trails'

urlpatterns = [
    path('admin/parks/', ParkListAdmin.as_view(), name='admin parks'),
    path('admin/', TrailListAdmin.as_view(), name='admin trails'),
    path('photos/', ImageList.as_view(), name='image'),
    path('edit/park/<int:pk>/', ParkDetailAdmin.as_view(), name='edit_park'),
    path('edit/<int:pk>/', TrailDetailAdmin.as_view(), name='edit_trail'),
]
