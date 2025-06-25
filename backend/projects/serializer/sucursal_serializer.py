from rest_framework import serializers;
from projects.models import Sucursal;

class SucursalSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Sucursal
        fields = '__all__'