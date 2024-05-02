from django.shortcuts import render

def index(request):
    return render(request, 'index.html')

def traductor_aplicacion(request):
    return render(request, 'Traductor-SLD.html')

def herramientas(request):
    return render(request, 'herramientas.html')

def nosotros(request):
    return render(request, 'nosotros.html')

def ejemplo(request):
    return render(request, 'ejemplo.html')

def numero(request):
    return render(request,'numero.html')