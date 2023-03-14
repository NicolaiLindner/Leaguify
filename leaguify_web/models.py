from django.db import models

# Create your models here.

class Summoner(models.Model):
    summonername = models.CharField(max_length=200)
    mainchamp = models.CharField(max_length=50)
    def __str__(self):
        return self.summonername

    