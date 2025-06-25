from rest_framework import serializers
from projects.models import OrdenItem, Producto

class OrdenItemSerializer(serializers.ModelSerializer):
    codigo_prod = serializers.IntegerField(write_only=True)
    nombre_producto = serializers.CharField(source='producto.nombre', read_only=True)
    codigo_producto = serializers.IntegerField(source='producto.codigo_prod', read_only=True)

    class Meta:
        model = OrdenItem
        fields = ['codigo_prod', 'codigo_producto', 'nombre_producto', 'cantidad']


