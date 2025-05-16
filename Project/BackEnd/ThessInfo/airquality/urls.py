from django.urls import path
from .views import (
    AreaAnnualAverageView,
    AreaLatestAnalysisView,
    AreaMultiYearAveragesView,
    AreaYearlyAnalysisView,
    AreaMonthlyAnalysisView,
    AreaYearlyGroupedView,
    BestAreasPerMonthView,
)

urlpatterns = [
    path('area/<str:area>/<int:year>/latest-measurements/', AreaLatestAnalysisView.as_view(), name='area-latest-measurements'),
    path('area/<str:area>/<int:year>/group-by-year/', AreaYearlyAnalysisView.as_view(), name='area-group-by-year'),
    path('area/<str:area>/<int:year>/month/<str:month_name>/', AreaMonthlyAnalysisView.as_view(), name='area-monthly-analysis'),
    path('best-areas/<int:year>/', BestAreasPerMonthView.as_view(), name='best-areas-per-month'),
    path('area/<str:area>/<int:year>/annual-averages/', AreaAnnualAverageView.as_view(), name='area-annual-averages'),
    path('area/<str:area>/<int:year>/grouped-by-year/', AreaYearlyGroupedView.as_view(), name='area-yearly-grouped'),
    path('area/<str:area>/all-years/', AreaMultiYearAveragesView.as_view(), name='area-multi-year-averages'),
]

