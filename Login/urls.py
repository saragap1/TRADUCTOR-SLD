from django.urls import path
from . import views

urlpatterns = [
    path('', views.login, name='login'),
    path('sign-up/', views.sign_up, name='sign-up'),
    
]
