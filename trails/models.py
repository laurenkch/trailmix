from django.conf import settings
from django.db import models

class Park(models.Model):
    name = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=8, decimal_places=6)
    longitude = models.DecimalField(max_digits=8, decimal_places=6)

    fee = models.CharField(max_length=255,null=True, blank=True)
    park_code = models.CharField(max_length=4, null=True, blank=True)
    hours = models.CharField(max_length=255, null=True, blank=True)
    activities = models.CharField(max_length=255, null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.name

class Trail(models.Model):
    park = models.ForeignKey(Park, related_name='trails', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    elevation_gain = models.IntegerField(blank=True, null=True)
    length = models.DecimalField(max_digits=8, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    description = models.TextField(null=True, blank=True)

    OUT_AND_BACK = 'oab'
    LOOP = 'loop'
    TRAIL_SEGMENT ='seg'

    TRAIL_TYPE_CHOICES = [
        (OUT_AND_BACK,'oab'),
        (LOOP,'loop'),
        (TRAIL_SEGMENT,'seg')
    ]

    trail_type = models.CharField(max_length=255, choices=TRAIL_TYPE_CHOICES, null=True, blank=True)

    def __str__(self):
        return self.name

class TrailImage(models.Model):
    trail = models.ForeignKey(Trail, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='trails/', blank=True, null=True)

class UserFeedback(models.Model):
    trail = models.ForeignKey(Trail, on_delete=models.CASCADE)
    dog_friendly = models.BooleanField(default = False, blank=False)
    no_pets_allowed = models.BooleanField(default=False, blank=False)
    muddy = models.BooleanField(default=False, blank=False)
    rocky = models.BooleanField(default=False, blank=False)
    steep = models.BooleanField(default=False, blank=False)
    shaded = models.BooleanField(default=False, blank=False)
    river_crossing = models.BooleanField(default=False, blank=False)
    limited_parking = models.BooleanField(default=False, blank=False)
    ample_parking = models.BooleanField(default=False, blank=False)
    clean_bathrooms = models.BooleanField(default=False, blank=False)
    no_bathrooms = models.BooleanField(default=False, blank=False)
    dirty_bathrooms = models.BooleanField(default=False, blank=False)
    no_cell_service = models.BooleanField(default=False, blank=False)
    strong_cell_signal = models.BooleanField(default=False, blank=False)
    weak_cell_signal = models.BooleanField(default=False, blank=False)
    kid_friendly = models.BooleanField(default=False, blank=False)
    paved = models.BooleanField(default=False, blank=False)
    wheelchair_accessible = models.BooleanField(default=False, blank=False)

    difficulty = models.IntegerField(null=True, blank=True)


class Trip(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField(null=True)
    trail = models.ForeignKey(
        Trail, on_delete=models.CASCADE)

