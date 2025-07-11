from rest_framework import serializers;
from projects.models.cliente import Cliente;
from django.contrib.auth.models import User

class ClienteSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=8)
    nombre_usuario = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Cliente
        fields = ['nombre', 'apellido', 'telefono', 'direccion', 'rut', 'email', 'password', 'nombre_usuario']

    def create(self, validated_data):
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        username = validated_data.pop('nombre_usuario', None)
        
        # Si no se proporciona username, generarlo basado en el nombre
        if not username:
            base_username = validated_data['nombre'].lower().replace(' ', '')
            username = base_username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1

        # Verificar si el email ya existe
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "Ya existe un usuario con este email."})
        
        # Verificar si el RUT ya existe
        if Cliente.objects.filter(rut=validated_data['rut']).exists():
            raise serializers.ValidationError({"rut": "Ya existe un cliente con este RUT."})

        user = User.objects.create_user(username=username, email=email, password=password)
        cliente = Cliente.objects.create(user=user, **validated_data)
        return cliente