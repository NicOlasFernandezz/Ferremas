from django.db import models


class Producto(models.Model):
    codigo_prod = models.IntegerField()
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    marca = models.CharField(max_length=100)
    categoria = models.CharField(max_length=50)
    stock = models.IntegerField()
    precio = models.DecimalField(max_digits=10, decimal_places=3)
    sucursal = models.ForeignKey('Sucursal', on_delete=models.CASCADE, related_name='productos')


    def __str__(self):
        return self.nombre
