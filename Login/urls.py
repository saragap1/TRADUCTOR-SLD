from django.urls import path
from . import views

urlpatterns = [
    path('', views.sign_in, name='login'),
    path('sign-up/', views.sign_up, name = 'sign-up'),
    path('sign-out/', views.sign_out, name = 'sign-out')
]
