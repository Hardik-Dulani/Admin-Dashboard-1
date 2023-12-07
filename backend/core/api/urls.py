
# urls.py
from django.contrib import admin
from django.urls import path
from .views import get_data

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', get_data, name='get_data'),
]
