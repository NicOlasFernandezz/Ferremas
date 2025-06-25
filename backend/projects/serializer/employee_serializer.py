from rest_framework import serializers
from projects.models import Cargo, Empleado
from django.contrib.auth.models import User
from django.utils.text import slugify


class EmpleadoSerializer(serializers.ModelSerializer):
    from .charge_serializer import CargoSerializer;
    from .user_serializer import UserSerializer;

    user = UserSerializer(read_only=True)
    cargo = CargoSerializer(read_only=True)
    cargo_id = serializers.PrimaryKeyRelatedField(queryset=Cargo.objects.all(), source='cargo', write_only=True)

    email = serializers.EmailField(write_only=True)
    email_user = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Empleado
        fields = ['user', 'rut', 'nombre', 'apellido', 'direccion', 'celular', 'is_active', 'cargo', 'cargo_id', 'must_change_password', 'email', 'email_user']

    def get_email_user(self, obj):
        return obj.user.email if obj.user else None

    def generar_username_unico(self, base_username):
        username = slugify(base_username)
        original = username
        contador = 1
        while User.objects.filter(username=username).exists():
            username = f"{original}{contador}"
            contador += 1
        return username

    def create(self, validated_data):
        rut = validated_data['rut']
        nombre = validated_data['nombre']
        email = validated_data.pop('email', None)

        if Empleado.objects.filter(rut=rut).exists():
            raise serializers.ValidationError({"rut": "Ya existe un empleado con este RUT."})
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "Ya existe un usuario con este email."})
        
        password = rut.replace(".", "").replace("-", "")
        username = self.generar_username_unico(nombre)
        
        user = User.objects.create_user(
            username=username,
            password=password,
            email=email
        )

        validated_data['user'] = user
        user.is_staff = True
        user.save()
        
        empleado = Empleado.objects.create(**validated_data)
        return empleado