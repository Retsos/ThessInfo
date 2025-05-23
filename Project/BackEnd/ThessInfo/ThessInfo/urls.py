from django.contrib import admin
from django.urls import path,include
from django.conf.urls.static import static
from django.conf import settings
from .view import NotifyView,ContactAPIView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('water/', include('waterquality.urls')),
    path('recycle/', include('recycle.urls')),
    path('airquality/', include('airquality.urls')),
    path('contact/', ContactAPIView.as_view(), name='contact'),

]
