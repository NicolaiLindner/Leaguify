from django.shortcuts import render
from django.http import HttpResponse
from .models import SummonerName

# Create your views here.
def index(request):
    return HttpResponse("Hello World")

def summonerName(request, SummonerName_id):
    all_names = SummonerName.objects.all()
    name = all_names[SummonerName_id]
    return HttpResponse("Your summoner name is %s" % name)