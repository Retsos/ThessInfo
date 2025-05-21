from django.urls import path
from .views import LatestAnalysisView, YearlyAnalysisView,RegionsLatestCompliantCountView,BestRegionView,MunicipalityStatsView


urlpatterns = [
    path('api/latest-measurements/', LatestAnalysisView.as_view(), name='latest-measurements'),
    path('api/group-by-year/', YearlyAnalysisView.as_view(), name='group-by-year'),
    path('api/regions-latest-compliance/',RegionsLatestCompliantCountView.as_view(),name='regions-latest-compliance'),
    path('BestRegionView/',BestRegionView.as_view(),name='Best-RegionView'),
    path('MarginAreas/',MunicipalityStatsView.as_view(),name='Margin-Areas'),

]