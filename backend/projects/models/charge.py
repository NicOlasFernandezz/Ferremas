from django.db import models

class Cargo(models.Model):
    nombre_cargo = models.CharField(max_length=150, unique=True)

    def __str__(self):
        return self.nombre_cargo