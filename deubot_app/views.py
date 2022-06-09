from django.shortcuts import render

def index(request):
    return render(request, 'deubot_app/index.html', {})