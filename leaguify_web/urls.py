from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('<int:SummonerName_id>/name', views.summonerName, name='name'),
    path('<int:SummonerName_id>/main', views.mainChamp, name='main')
]