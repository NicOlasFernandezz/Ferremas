from rest_framework import serializers;
from projects.models.cliente import Cliente;
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User

class ClienteSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=8)
    nombre_usuario = serializers.CharField(write_only=True)

    class Meta:
        model = Cliente
        fields = ['nombre', 'apellido', 'telefono', 'direccion', 'rut', 'email', 'password', 'nombre_usuario']

    def create(self, validated_data):
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        username = validated_data.pop('nombre_usuario')

        user = User.objects.create_user(username=username, email=email, password=password)
        cliente = Cliente.objects.create(user=user, **validated_data)
        token, _ = Token.objects.get_or_create(user=user)
        return cliente