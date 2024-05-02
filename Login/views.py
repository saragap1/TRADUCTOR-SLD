from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import login, logout, authenticate
from django.db import IntegrityError


def sign_in(request):
    if request.method == 'GET':
        return render(request, 'signin.html')
    else:
        user = authenticate(
            request, username=request.POST['username'], password=request.POST['password'])
        if user is None:
            return render(request, 'signin.html', {
                'error' : 'Usuario y/o contraseña incorrecto'
            })
        else:
            login(request, user)
            return redirect('/website/')

def sign_up(request):
    if request.method == 'GET':
        return render(request, 'signup.html')
    else:
        if request.POST['password1'] == request.POST['password2']:
            try:
                user = User.objects.create_user(
                    username=request.POST['username'], password=request.POST['password1'], email=request.POST['email'])
                user.save()
                login(request, user)
                return redirect('/website/')
            except IntegrityError:
                return render(request, 'signup.html', {
                    'error': 'Usuario creado previamente.'
                })
        return render(request, 'signup.html', {
            'error': 'Las contraseñas no coinciden'
        })


def sign_out(request):
    logout(request)
    return redirect('login')
