from rest_framework import serializers;
from projects.models import Producto, Sucursal;

class ProductoSerializer(serializers.ModelSerializer):
    from .sucursal_serializer import SucursalSerializer
    sucursal = SucursalSerializer(read_only=True)
    sucursal_id = serializers.PrimaryKeyRelatedField(
        queryset=Sucursal.objects.all(), source='sucursal', write_only=True)

    class Meta:
        model = Producto;
        fields = '__all__'
