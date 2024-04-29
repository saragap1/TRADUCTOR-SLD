from django.urls import path
from . import views

urlpatterns = [
    path('',                views.index,                name='index'),
    path('traductor/',      views.traductor_aplicacion, name='traductor'),
    path('nosotros/',       views.nosotros,             name='nosotros'),
    path('herramientas/',   views.herramientas,         name='herramientas'),
    path('traductor-inteligencia/',   views.traductor_aplicacion_inteligencia,         name='traductor-inteligencia'),
]
