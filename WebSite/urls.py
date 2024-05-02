from django.urls import path
from . import views

urlpatterns = [
    path('',                views.index,                name='index'),
    path('traductor/',      views.traductor_aplicacion, name='traductor'),
    path('nosotros/',       views.nosotros,             name='nosotros'),
    path('herramientas/',   views.herramientas,         name='herramientas'),
    path('ejemplo/',   views.ejemplo,         name='ejemplo'),
    path('numero/',   views.numero,         name='numero')
]
