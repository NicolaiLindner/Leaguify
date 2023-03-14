from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

from .models import Summoner

def index(request):
    template = loader.get_template('leaguify_web/index.html')
    mainChamps = Summoner.objects.all().values()[0]['mainchamp']
    context = {
        'mainChamps': mainChamps,
    }
    return HttpResponse(template.render(context, request))

def summonerName(request, SummonerName_id):
    name = Summoner.objects.filter(id=SummonerName_id).values()[0]['summonername']
    return HttpResponse("Your summoner name is %s" % name)

def mainChamp(request, SummonerName_id):
    mainChamp = Summoner.objects.filter(id=SummonerName_id).values()[0]['mainchamp']
    return HttpResponse("Your main champion is %s" % mainChamp)