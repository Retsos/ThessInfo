from django.urls import path
from .views import recycling_view,average_view,recycling_viewperperson

urlpatterns = [
    path('recycling/', recycling_view, name='recycling_view'),
    path('recycling2/', recycling_viewperperson, name='recycling_view'),
    path('recycling-good/', average_view, name='recycling_view'),
]