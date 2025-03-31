from django.urls import path
from .views import (
    air_quality_view, get_best_hour, get_best_day, get_best_month, 
    get_daily_data, get_monthly_data, get_range_sum, get_total_sum, 
    get_pollutant_ranking
)

urlpatterns = [
    # Base air quality endpoint (with optional filters via query params)
    path('api/air-quality/<str:area>/', air_quality_view, name='air-quality'),

    # Specific queries
    path('api/air-quality/<str:area>/best-hour/', get_best_hour, name='best-hour'),
    path('api/air-quality/<str:area>/best-day/<str:month>/', get_best_day, name='best-day'),
    path('api/air-quality/<str:area>/best-month/', get_best_month, name='best-month'),

    # Summaries
    path('api/air-quality/<str:area>/daily/<str:month>/', get_daily_data, name='daily-data'),
    path('api/air-quality/<str:area>/monthly/<str:month>/', get_monthly_data, name='monthly-data'),
    path('api/air-quality/<str:area>/range/<str:start_month>/<str:end_month>/', get_range_sum, name='range-sum'),
    path('api/air-quality/<str:area>/total/', get_total_sum, name='total-sum'),

    # Pollutant ranking
    path('api/air-quality/<str:area>/ranking/', get_pollutant_ranking, name='pollutant-ranking'),
]
