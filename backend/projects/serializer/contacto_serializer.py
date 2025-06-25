from rest_framework import serializers;
from projects.models import Producto, Cliente, Contacto

class ContactoSerializer(serializers.ModelSerializer):
    from .product_serializer import ProductoSerializer
    from .cliente_serializer import ClienteSerializer
    
    producto = ProductoSerializer(read_only=True)
    producto_id = serializers.PrimaryKeyRelatedField(queryset=Producto.objects.all(), write_only=True, source='producto')

    cliente = ClienteSerializer(read_only=True)
    cliente_id = serializers.PrimaryKeyRelatedField(queryset=Cliente.objects.all(), write_only=True, source='cliente')

    class Meta:
        model = Contacto
        fields = ['id', 'cliente', 'cliente_id', 'producto', 'producto_id', 'mensaje', 'fecha_contacto']