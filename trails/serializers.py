from itertools import count
from rest_framework import serializers
from django.db.models import Avg, Count, Sum
import requests
from datetime import datetime, timedelta, date
from django.conf import settings
from .models import Trail, Trip, UserFeedback, TrailImage, Park


class ParkNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Park
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


class ShallowTrailSerializer(serializers.ModelSerializer):

    class Meta:
        model = Trail
        fields = '__all__'


class DeepTrailSerializer(serializers.ModelSerializer):
    images = ImageSerializer
    difficulty = serializers.SerializerMethodField()
    steep = serializers.SerializerMethodField()
    muddy = serializers.SerializerMethodField()
    rocky = serializers.SerializerMethodField()
    shaded = serializers.SerializerMethodField()
    river_crossing = serializers.SerializerMethodField()
    kid_friendly = serializers.SerializerMethodField()
    paved = serializers.SerializerMethodField()
    wheelchair_accessible = serializers.SerializerMethodField()
    pet_stance = serializers.SerializerMethodField()
    parking = serializers.SerializerMethodField()
    bathrooms = serializers.SerializerMethodField()
    cell_strength = serializers.SerializerMethodField()
    weather = serializers.SerializerMethodField()

    class Meta:
        model = Trail
        fields = '__all__'
        depth = 1

    def get_weather(self, obj):

        lat = str(float(obj.park.latitude))
        lon = str(float(obj.park.longitude))

        baseurl = 'https://api.openweathermap.org/data/2.5/onecall?'
        url = baseurl+'lat='+lat+'&lon='+lon + \
            '&exclude=current,hourly,minutely&units=imperial'+'&appid='+settings.API_KEY

        r = requests.get(url)

        if not r.ok:
            message = r.json()
            return message

        data = r.json()

        for item in data['daily']:
            item['dt'] = datetime.fromtimestamp(
                item['dt']).strftime('%Y-%m-%d %H:%M:%S')[0:10]
            item['sunrise'] = datetime.fromtimestamp(
                item['sunrise']).strftime('%Y-%m-%d %H:%M:%S')[11:]
            item['sunset'] = datetime.fromtimestamp(
                item['sunset']).strftime('%Y-%m-%d %H:%M:%S')[11:]
            item['moonrise'] = datetime.fromtimestamp(
                item['moonrise']).strftime('%Y-%m-%d %H:%M:%S')[11:]
            item['moonset'] = datetime.fromtimestamp(
                item['moonset']).strftime('%Y-%m-%d %H:%M:%S')[11:]

        return data

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
        else:
            return 0

    def get_steep(self, obj):

        variables = UserFeedback.objects.filter(trail=obj.id).aggregate(
            total=Count('steep'), num=Sum('steep'))

        if variables['num']:
            average = variables['num']/variables['total']
            if average > 0.5:
                return True
            else:
                return False
        else:
            return False

    def get_muddy(self, obj):

        variables = UserFeedback.objects.filter(trail=obj.id).aggregate(
            total=Count('muddy'), num=Sum('muddy'))

        if variables['num']:
            average = variables['num']/variables['total']
            if average > 0.5:
                return True
            else:
                return False
        else:
            return False

    def get_shaded(self, obj):

        variables = UserFeedback.objects.filter(trail=obj.id).aggregate(
            total=Count('shaded'), num=Sum('shaded'))

        if variables['num']:
            average = variables['num']/variables['total']
            if average > 0.5:
                return True
            else:
                return False
        else:
            return False

    def get_rocky(self, obj):

        variables = UserFeedback.objects.filter(trail=obj.id).aggregate(
            total=Count('rocky'), num=Sum('rocky'))

        if variables['num']:
            average = variables['num']/variables['total']
            if average > 0.5:
                return True
            else:
                return False
        else:
            return False

    def get_river_crossing(self, obj):

        variables = UserFeedback.objects.filter(trail=obj.id).aggregate(
            total=Count('river_crossing'), num=Sum('river_crossing'))

        if variables['num']:
            average = variables['num']/variables['total']
            if average > 0.5:
                return True
            else:
                return False
        else:
            return False

    def get_kid_friendly(self, obj):

        variables = UserFeedback.objects.filter(trail=obj.id).aggregate(
            total=Count('kid_friendly'), num=Sum('kid_friendly'))

        if variables['num']:
            average = variables['num']/variables['total']
            if average > 0.5:
                return True
            else:
                return False
        else:
            return False

    def get_paved(self, obj):

        variables = UserFeedback.objects.filter(trail=obj.id).aggregate(
            total=Count('paved'), num=Sum('paved'))

        if variables['num']:
            average = variables['num']/variables['total']
            if average > 0.5:
                return True
            else:
                return False
        else:
            return False

    def get_wheelchair_accessible(self, obj):

        variables = UserFeedback.objects.filter(trail=obj.id).aggregate(
            total=Count('wheelchair_accessible'), num=Sum('wheelchair_accessible'))

        if variables['num']:
            average = variables['num']/variables['total']
            if average > 0.5:
                return True
            else:
                return False
        else:
            return False

    def get_pet_stance(self, obj):

        df = UserFeedback.objects.filter(trail=obj.id).filter(
            pet_stance='df').aggregate(count=Count('pet_stance'))
        np = UserFeedback.objects.filter(
            trail=obj.id, pet_stance='np').aggregate(count=Count('pet_stance'))

        if df['count'] > 0 or np['count'] > 0:
            if df['count'] > np['count']:
                return 'df'
            else:
                return 'np'
        else:
            return False

    def get_parking(self, obj):

        lpark = UserFeedback.objects.filter(trail=obj.id).filter(
            parking='lpark').aggregate(count=Count('parking'))
        apark = UserFeedback.objects.filter(
            trail=obj.id, pet_stance='apark').aggregate(count=Count('parking'))

        if lpark['count'] > 0 or apark['count'] > 0:
            if lpark['count'] > apark['count']:
                return 'lpark'
            else:
                return 'apark'
        else:
            return False

    def get_bathrooms(self, obj):

        nbath = UserFeedback.objects.filter(trail=obj.id,
                                            bathrooms='nbath').aggregate(count=Count('bathrooms'))
        dbath = UserFeedback.objects.filter(
            trail=obj.id, bathrooms='dbath').aggregate(count=Count('bathrooms'))
        cbath = UserFeedback.objects.filter(
            trail=obj.id, bathrooms='cb').aggregate(count=Count('bathrooms'))

        if nbath['count'] > 0 or dbath['count'] > 0 or cbath['count'] > 0:
            if nbath['count'] > dbath['count'] and nbath['count'] > cbath['count']:
                return 'nbath'
            elif dbath['count'] > nbath['count'] and dbath['count'] > cbath['count']:
                return 'dbath'
            else:
                return 'cbath'
        else:
            return False

    def get_cell_strength(self, obj):

        ncell = UserFeedback.objects.filter(trail=obj.id,
                                            cell_strength='ncell').aggregate(count=Count('cell_strength'))
        wcell = UserFeedback.objects.filter(trail=obj.id,
                                            cell_strength='wcell').aggregate(count=Count('cell_strength'))
        scell = UserFeedback.objects.filter(trail=obj.id,
                                            cell_strength='scell').aggregate(count=Count('cell_strength'))

        if ncell['count'] > 0 or wcell['count'] > 0 or scell['count'] > 0:
            if ncell['count'] > wcell['count'] and ncell['count'] > scell['count']:
                return 'ncell'
            elif wcell['count'] > ncell['count'] and wcell['count'] > scell['count']:
                return 'wcell'
            else:
                return 'scell'
        else:
            return False


class TripDeepSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    trailname = serializers.ReadOnlyField(source='trail.name')
    parkname = serializers.ReadOnlyField(source='trail.park.name')
    latitude = serializers.ReadOnlyField(source='trail.park.latitude')
    longitude = serializers.ReadOnlyField(source='trail.park.longitude')
    fees = serializers.ReadOnlyField(source='trail.park.fees')
    address = serializers.ReadOnlyField(source='trail.park.address')
    weather = serializers.SerializerMethodField()
    time = serializers.TimeField(allow_null=True,
                                 format=settings.TIME_INPUT_FORMATS, input_formats=[settings.TIME_INPUT_FORMATS, ])
    fee = serializers.ReadOnlyField(source='trail.park.fee')
    length = serializers.ReadOnlyField(source='trail.length')
    elevation_gain = serializers.ReadOnlyField(source='trail.elevation_gain')
    trail_type = serializers.ReadOnlyField(source='trail.trail_type')
    difficulty = serializers.SerializerMethodField()

    class Meta:
        model = Trip
        fields = '__all__'
        depth = 1

    def get_weather(self, obj):

        cutoffDate = date.today() + timedelta(days=7)

        if obj.date < cutoffDate:

            lat = str(float(obj.trail.park.latitude))
            lon = str(float(obj.trail.park.longitude))
            baseurl = 'https://api.openweathermap.org/data/2.5/onecall?'
            url = baseurl+'lat='+lat+'&lon='+lon + \
                '&exclude=current,hourly,minutely&units=imperial'+'&appid='+settings.API_KEY

            r = requests.get(url)

            if not r.ok:
                message = r.json()
                return message

            data = r.json()

            # return obj.date

            for item in data['daily']:
                item['dt'] = datetime.fromtimestamp(
                    item['dt']).strftime('%Y-%m-%d %H:%M:%S')

            for item in data['daily']:
                item['dt'] = str(item['dt'])[0:10]

            new_daily = list()
            for item in data['daily']:
                if str(item['dt']) == str(obj.date):
                    new_daily.append(item)

            data['daily'] = new_daily

            data['daily'][0]['sunrise'] = datetime.fromtimestamp(
                data['daily'][0]['sunrise']).strftime('%Y-%m-%d %H:%M:%S')[11:]
            data['daily'][0]['sunset'] = datetime.fromtimestamp(
                data['daily'][0]['sunset']).strftime('%Y-%m-%d %H:%M:%S')[11:]
            data['daily'][0]['moonrise'] = datetime.fromtimestamp(
                data['daily'][0]['moonrise']).strftime('%Y-%m-%d %H:%M:%S')[11:]
            data['daily'][0]['moonset'] = datetime.fromtimestamp(
                data['daily'][0]['moonset']).strftime('%Y-%m-%d %H:%M:%S')[11:]

            return data

        else:
            return False

    def get_difficulty(self, obj):
        if obj.trail.length < 3 and obj.trail.elevation_gain < 500:
            return 1
        if obj.trail.length < 5 and obj.trail.elevation_gain < 1000:
            return 2
        if obj.trail.length < 7 and obj.trail.elevation_gain < 1500:
            return 3
        if obj.trail.length < 9 and obj.trail.elevation_gain < 2000:
            return 4
        if obj.trail.length < 11 and obj.trail.elevation_gain < 2500:
            return 5
        if obj.trail.length > 11 or obj.trail.elevation_gain > 2500:
            return 6
        else:
            return 0


class TripShallowSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    trailname = serializers.ReadOnlyField(source='trail.name')
    parkname = serializers.ReadOnlyField(source='trail.park.name')
    latitude = serializers.ReadOnlyField(source='trail.park.latitude')
    longitude = serializers.ReadOnlyField(source='trail.park.longitude')
    fees = serializers.ReadOnlyField(source='trail.park.fees')
    address = serializers.ReadOnlyField(source='trail.park.address')
    time = serializers.TimeField(allow_null=True, format=settings.TIME_INPUT_FORMATS, input_formats=[
                                 settings.TIME_INPUT_FORMATS, ],)


    class Meta:
        model = Trip
        fields = ('date', 'time', 'trail', 'username',
                  'trailname', 'id', 'parkname', 'latitude', 'longitude', 'fees', 'address', 'notes')
