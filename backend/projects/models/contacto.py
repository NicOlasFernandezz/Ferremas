from django.db import models

class Contacto(models.Model):
    cliente = models.ForeignKey('Cliente', on_delete=models.CASCADE, related_name='contactos')
    producto = models.ForeignKey('Producto', on_delete=models.CASCADE, related_name='contactos')
    mensaje = models.TextField()
    fecha_contacto = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.cliente.nombre} - {self.producto.nombre}"