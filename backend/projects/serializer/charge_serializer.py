from rest_framework import serializers;
from projects.models.charge import Cargo;

class CargoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cargo
        fields = '__all__'