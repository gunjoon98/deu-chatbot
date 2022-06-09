from django.urls import path
from deubot_app import views

urlpatterns = [
    path('', views.index, name='index'),
]
