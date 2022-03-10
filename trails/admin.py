from django.contrib import admin

from .models import Trail, TrailImage, UserFeedback, Trip, Park

admin.site.register(Trail)
admin.site.register(TrailImage)
admin.site.register(UserFeedback)
admin.site.register(Trip)
admin.site.register(Park)
