from django.urls import path
from .views import recycling_view

urlpatterns = [
    path('recycling/', recycling_view, name='recycling_view'),
]