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



# class ImageSerializer(serializers.ModelSerializer):
#     trail_id = serializers.ReadOnlyField(source='trail.id')
#     class Meta:
#         model = TrailImage
#         fields = ['id', 'image','trail','trail_id']


class UserFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFeedback
        fields = '__all__'


class DeepTrailSerializer(serializers.ModelSerializer):
    images = ImageSerializer
    class Meta:
        model = Trail
        fields = '__all__'
        depth = 1


# class ShallowTrailSerializer(serializers.ModelSerializer):
#     images = ImageSerializer

#     class Meta:
#         model = Trail
#         fields = '__all__'


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



