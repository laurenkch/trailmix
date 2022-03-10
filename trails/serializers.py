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


class ParkSerializer(serializers.ModelSerializer):
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
    class Meta:
        model = Trip
        fields = '__all__'



