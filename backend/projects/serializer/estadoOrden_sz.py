from projects.models.orden import Orden
from projects.serializer.ordenItem_sz import OrdenItemSerializer
from rest_framework import serializers

class EstadoOrdenSerializer(serializers.ModelSerializer):
    items = OrdenItemSerializer(many=True, read_only=True)

    class Meta:
        model = Orden
        fields = ['id', 'total', 'estado', 'transaccion_id', 'items', 'fecha']
