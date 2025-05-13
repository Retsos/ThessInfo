from django.urls import path
from .views import recycling_view,average_view,recycling_viewperperson

urlpatterns = [
    path('recycling-ota/', recycling_view, name='recycling_view'),
    path('recycling-perperson/', recycling_viewperperson, name='recycling_view'),
    path('recycling-good/', average_view, name='recycling_view'),
]