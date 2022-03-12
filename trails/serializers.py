from rest_framework import serializers

from .models import Trail, Trip, UserFeedback, TrailImage, Park

class ParkNameSerializer(serializers.ModelSerializer):
    class Meta:
        model=Park
        fields = ['id', 'park_name']


class ImageSerializer(serializers.ModelSerializer):
    trail_id = serializers.ReadOnlyField(source='trail.id')

    class Meta:
        model = TrailImage
        fields = ['id', 'image', 'trail', 'trail_id']

class ShallowTrailSerializer(serializers.ModelSerializer):
    images = ImageSerializer

    class Meta:
        model = Trail
        fields = '__all__'


class ParkCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Park
        fields = '__all__'

class ParkViewSerializer(serializers.ModelSerializer):
    trails = ShallowTrailSerializer(many=True)

    class Meta:
        model = Park
        fields = ["id",
                  "name",
                  "latitude",
                  "longitude",
                  "fee",
                  "park_code",
                  "hours",
                  "activities",
                  "address", 'trails']
        depth = 1


class UserFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFeedback
        fields = '__all__'


class DeepTrailSerializer(serializers.ModelSerializer):
    images = ImageSerializer
    difficulty = serializers.SerializerMethodField()

    class Meta:
        model = Trail
        fields = '__all__'
        depth = 1

    def get_difficulty(self, obj):
        if obj.length < 3 and obj.elevation_gain < 500:
            return 1
        if obj.length < 5 and obj.elevation_gain < 1000:
            return 2
        if obj.length < 7 and obj.elevation_gain < 1500:
            return 3
        if obj.length < 9 and obj.elevation_gain < 2000:
            return 4
        if obj.length < 11 and obj.elevation_gain < 2500:
            return 5
        if obj.length > 11 or obj.elevation_gain > 2500:
            return 6



class TripSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    trailname = serializers.ReadOnlyField(source='trail.name')
    parkname = serializers.ReadOnlyField(source='trail.park.name')
    latitude = serializers.ReadOnlyField(source='trail.park.latitude')
    longitude = serializers.ReadOnlyField(source='trail.park.longitude')
    fees = serializers.ReadOnlyField(source='trail.park.fees')
    address = serializers.ReadOnlyField(source='trail.park.address')
    class Meta:
        model = Trip
        fields = ('date', 'time', 'trail', 'username',
                  'trailname', 'id', 'parkname', 'latitude','longitude','fees','address')



