from django.db import models

class Sucursal(models.Model):
    nombre = models.CharField(max_length=100)
    comuna = models.CharField(max_length=100)
    dirección = models.CharField(max_length=450)
    numero = models.IntegerField()

    def __str__(self):
        return self.nombre