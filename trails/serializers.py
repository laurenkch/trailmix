from rest_framework import serializers

from .models import Trail, Trip, UserFeedack, TrailImage


class TrailImageSerializer:
    class Meta:
        model = TrailImage
        fields = '__all__'


class UserFeedbackSerializer:
    class Meta:
        model = UserFeedack
        fields = '__all__'

class TrailSerializer:
    images = TrailImageSerializer(many=True, read_only=True)
    class Meta:
        model = Trail
        fields = '__all__'



class TripSerializer:
    class Meta:
        model = Trip
        fields = '__all__'



