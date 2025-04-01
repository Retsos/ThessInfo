from django.urls import path
from .views import (
    air_quality_view, get_best_hour, get_best_day, get_best_month,
    get_daily_data, get_monthly_data, get_range_sum, get_total_sum,
    get_pollutant_ranking
)

urlpatterns = [
    # Base air quality endpoint
    path('airquality/<str:area>/', air_quality_view, name='air-quality'),

    # Specific queries
    path('airquality/<str:area>/best-hour/', get_best_hour, name='best-hour'),
    path('airquality/<str:area>/best-day/<str:month>/', get_best_day, name='best-day'),
    path('airquality/<str:area>/best-month/', get_best_month, name='best-month'),

    # Summaries
    path('airquality/<str:area>/daily/<str:month>/', get_daily_data, name='daily-data'),
    path('airquality/<str:area>/monthly/', get_monthly_data, name='monthly-data'),  # Removed month param
    path('airquality/<str:area>/total/', get_total_sum, name='total-sum'),

    # Time range with optional days and hours
    path(
        'airquality/<str:area>/range/<str:start_month>/<str:end_month>/',
        get_range_sum,
        name='range-sum'
    ),
    path(
        'airquality/<str:area>/range/<str:start_month>/<str:end_month>/<int:start_day>/<int:end_day>/',
        get_range_sum,
        name='range-sum-days'
    ),
    path(
        'airquality/<str:area>/range/<str:start_month>/<str:end_month>/<int:start_day>/<int:end_day>/<int:start_hour>/<int:end_hour>/',
        get_range_sum,
        name='range-sum-hours'
    ),

    # Pollutant ranking
    path('airquality/<str:area>/ranking/', get_pollutant_ranking, name='pollutant-ranking'),
]
