from django.urls import path
from .views import (
    AreaLatestAnalysisView,
    AreaYearlyAnalysisView,
    BestAreasPerYearComplianceView,
)

urlpatterns = [
    path('area/<str:area>/latest-measurements/', AreaLatestAnalysisView.as_view(), name='area-latest-measurements'),
    path('area/<str:area>/group-by-year/', AreaYearlyAnalysisView.as_view(), name='area-group-by-year'),
    path('best-areas/', BestAreasPerYearComplianceView.as_view(), name='best-areas-per-month'),

]

