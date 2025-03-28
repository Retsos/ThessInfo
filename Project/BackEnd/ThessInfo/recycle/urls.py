from django.urls import path
from .views import recycling_view,average_view,recycling_view2

urlpatterns = [
    path('recycling/', recycling_view, name='recycling_view'),
    path('recycling2/', recycling_view2, name='recycling_view'),
    path('recycling-good/', average_view, name='recycling_view'),
]