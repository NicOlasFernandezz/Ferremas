from django.db import models
from django.contrib.auth.models import User

class Empleado(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    rut = models.CharField(max_length=12, unique=True)
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    direccion = models.CharField(max_length=450)
    celular = models.PositiveIntegerField()
    is_active = models.BooleanField(default=True)
    cargo = models.ForeignKey('Cargo', on_delete=models.CASCADE, related_name='empleados')
    must_change_password = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nombre} {self.apellido}"