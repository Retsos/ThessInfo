from django.urls import path
from .views import LatestAnalysisView, YearlyAnalysisView

urlpatterns = [
    path('api/latest-measurements/', LatestAnalysisView.as_view(), name='latest-measurements'),
    path('api/group-by-year/', YearlyAnalysisView.as_view(), name='group-by-year'),
]