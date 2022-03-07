from django.shortcuts import render


from .models import CustomUser
from .serializers import UserDetailsSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response


# class ProfileListAPIView(generics.ListAPIView):
#     queryset = Profile.objects.all()
#     serializer_class = ProfileSerializer

#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user)
