from django.shortcuts import render

def login(request):
    return render(request, 'login.html')

def sign_up(request):
    return render(request, 'signup.html')