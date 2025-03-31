from django.contrib import admin
from django.urls import path
from .views import air_quality_view  # Import the air quality view

urlpatterns = [
    # Capture the area as a string (e.g., Pylaia, Thessaloniki)
    path('api/air-quality/<str:area>/', air_quality_view, name='air-quality'),
]
