from django.contrib import admin

from .models import Trail, TrailImage, UserFeedack, Trip, Park

admin.site.register(Trail)
admin.site.register(TrailImage)
admin.site.register(UserFeedack)
admin.site.register(Trip)
admin.site.register(Park)
