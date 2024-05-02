from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required
def index(request):
    return render(request, 'index.html')

@login_required
def traductor_aplicacion(request):
    return render(request, 'Traductor-SLD.html')

@login_required
def traductor_aplicacion_inteligencia(request):
    return render(request, 'Traductor-SLD-inteligencia.html')

@login_required
def herramientas(request):
    return render(request, 'herramientas.html')

@login_required
def nosotros(request):
    return render(request, 'nosotros.html')