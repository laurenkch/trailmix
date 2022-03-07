from django.conf import settings
from django.db import models

class Trail(models.Model):
    name = models.CharField(max_length=255)
    latitude = models.IntegerField()
    longitude = models.IntegerField()
    elevation = models.IntegerField()
    length = models.IntegerField()
    fee = models.IntegerField(null=True)
    address = models.CharField(max_length=255, null = True)
    park_code = models.CharField(max_length=4, null=True)
    hours = models.CharField(max_length = 255)
    activities = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    EASY = 'Easy'
    MODERATE = 'Moderate'
    DIFFICULT = 'Difficult'

    DIFFICULTY_CHOICES = [
        (EASY, 'Easy'),
        (MODERATE, 'Moderate'),
        (DIFFICULT, 'Difficult'),
    ]

    difficulty = models.CharField(max_length=255, choices=DIFFICULTY_CHOICES)

    def __str__(self):
        return self.title

class TrailImage(models.Model):
    trail = models.ForeignKey(Trail, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='trails/', blank=True, null=True)

class UserFeedack(models.Model):
    trail = models.ForeignKey(Trail, on_delete=models.CASCADE)
    badges = models.TextField(blank=True)
    # DOG_FRIENDLY = 'DF'
    # NO_PETS_ALLOWED = 'NPA'
    # MUDDY = 'Muddy'
    # ROCKY = 'Rocky'
    # STEEP = 'Steep'
    # LIMITED_PARKING = 'LP'
    # AMPLE_PARKING = 'AP'
    # CLEAN_BATHROOMS = 'CB'
    # NO_BATHROOMS = 'NB'
    # DIRTY_BATHROOMS = 'DB'
    # RIVER_CROSSING = 'RC'
    # NO_CELL_SERVICE = 'NCS'
    # STRONG_CELL_SERVICE = 'SCS'
    # WEAK_CELL_SERVICE = 'WCS'
    # KID_FRIENDLY = 'KF'
    # SHADED = 'Shaded'
    # RIVER_CROSSING = 'RC'


    # BADGES_CHOICES = [
    #     (DOG_FRIENDLY, 'DF'),
    #     (NO_PETS_ALLOWED, 'NPA')
    #     (MUDDY, 'Muddy')
    #     (ROCKY, 'Rocky')
    #     (STEEP, 'Steep')
    #     (LIMITED_PARKING, 'LP'),
    #     (AMPLE_PARKING, 'AP'),
    #     (CLEAN_BATHROOMS, 'CB'),
    #     (NO_BATHROOMS, 'NB'),
    #     (DIRTY_BATHROOMS, 'DB'),
    #     (RIVER_CROSSING, 'RC'),
    #     (NO_CELL_SERVICE, 'NCS'),
    #     (STRONG_CELL_SERVICE, 'SCS'),
    #     (WEAK_CELL_SERVICE, 'WCS'),
    #     (KID_FRIENDLY, 'KF'),
    #     (SHADED, 'Shaded'),
    #     (RIVER_CROSSING, 'RC'),
    # ]

    EASY = 'Easy'
    MODERATE = 'Moderate'
    DIFFICULT = 'Difficult'

    DIFFICULTY_CHOICES = [
        (EASY, 'Easy'),
        (MODERATE, 'Moderate'),
        (DIFFICULT, 'Difficult'),
    ]

    difficulty = models.CharField(max_length=255, choices=DIFFICULTY_CHOICES, blank=True)


class Trip(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField(null=True)
    trail = models.ForeignKey(
        Trail, on_delete=models.CASCADE)

