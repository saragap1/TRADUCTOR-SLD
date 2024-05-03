from django.shortcuts import render,redirect
from django.contrib.auth.decorators import login_required
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from django.conf import settings
from django.contrib import messages
from .forms import documentForm
from .models import documents

@login_required
def index(request):
    return render(request, 'index.html')

@login_required
def traductor_aplicacion(request):
    if request.method == 'GET':
        return render(request, 'Traductor-SLD.html', {
            'form': documentForm 
        })
    elif request.method == 'POST':
        try:
            # Variables necesarias para base de datos y envio de correo 
            session = request.user  
            message = request.POST
            name = session.username
            subject = 'Traducción de SLD'
            email = session.email
            
            # Subir info a base de datos
            doc = documentForm(message).save(commit=False)
            doc.user = session
            doc.save()

            
            # Contenido del correo
            template = render_to_string('email_template.html',{
                'name':name,
                'message':message['content'],
                'email':email
            })

            # Configuracion y envio de correo
            email = EmailMessage(
                subject,
                template,
                settings.EMAIL_HOST_USER,
                [email]
            )
            email.fail_silently=False
            #email.attach_file()
            email.send()
            messages.success(request,'Se ha enviado correctamente el correo')
            return redirect('traductor')
        
        except ValueError:
            return render(request, 'Traductor-SLD.html', {
            'form': documentForm,
            'error': 'Error: invalid data, intenta de nuevo' 
        })
@login_required
def traductor_aplicacion_inteligencia(request):
    return render(request, 'Traductor-SLD-inteligencia.html')

@login_required
def herramientas(request):
    return render(request, 'herramientas.html')

@login_required
def nosotros(request):
    return render(request, 'nosotros.html')