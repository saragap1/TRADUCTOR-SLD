from django.shortcuts import render

def index(request):
    return render(request, 'index.html')

def traductor_aplicacion(request):
    return render(request, 'Traductor-SLD.html')

def traductor_aplicacion_inteligencia(request):
    return render(request, 'Traductor-SLD-inteligencia.html')


def herramientas(request):
    return render(request, 'herramientas.html')

def nosotros(request):
    return render(request, 'nosotros.html')