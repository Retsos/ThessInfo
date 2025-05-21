from django.urls import path
from .views import (
    AreaLatestAnalysisView,
    AreaYearlyAnalysisView,
    BestAreaLatestYearComplianceView,
    MonthlyComplianceAverageView,
    WorstAreaComplianceView,
)

urlpatterns = [
    path('area/<str:area>/latest-measurements/', AreaLatestAnalysisView.as_view(), name='area-latest-measurements'),
    path('area/<str:area>/group-by-year/', AreaYearlyAnalysisView.as_view(), name='area-group-by-year'),
    path('best-area-latest/', BestAreaLatestYearComplianceView.as_view(), name='best-area-latest'),
    path('monthly-compliance/', MonthlyComplianceAverageView.as_view(), name='monthly-compliance'),
    path('worst-area/', WorstAreaComplianceView.as_view(), name='worst-area'),
    
]

