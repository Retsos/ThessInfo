from django.urls import path
from .views import AreaLatestAnalysisView, AreaYearlyAnalysisView

urlpatterns = [
    path('area/<str:area>/latest-measurements/', AreaLatestAnalysisView.as_view(), name='area-latest-measurements'),
    path('area/<str:area>/group-by-year/', AreaYearlyAnalysisView.as_view(), name='area-group-by-year'),
]
