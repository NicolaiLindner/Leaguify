import requests
from django.shortcuts import render
from .models import Summoner
from .forms import SummonerSearchForm

# Temp 
API_KEY = 'RGAPI-5850ece4-768b-43b4-8d28-88a8a84a577f'
RIOT_API_BASE_URL = 'https://euw1.api.riotgames.com/lol'


def search(request):
    if request.method == 'POST':
        form = SummonerSearchForm(request.POST)
        if form.is_valid():
            summoner_name = form.cleaned_data['summoner_name']
            # fetch_and_save_summoner_data(summoner_name)
            summoner = Summoner(name=summoner_name, main_champion='Ahri', rank='Gold IV')
        else:
            summoner = None
    else:
        form = SummonerSearchForm()
        summoner = None

    return render(request, 'project1.html', {'form': form, 'summoner': summoner})
