from rest_framework import serializers

from .models import Trail, Trip, UserFeedack, TrailImage, Park

class ParkNameSerializer(serializers.ModelSerializer):
    class Meta:
        model=Park
        fields = ['id', 'park_name']


class ParkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Park
        fields = '__all__'

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrailImage
        fields = '__all__'


class UserFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFeedack
        fields = '__all__'


class TrailSerializer(serializers.ModelSerializer):
    images = ImageSerializer
    class Meta:
        model = Trail
        fields = '__all__'


class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = '__all__'


