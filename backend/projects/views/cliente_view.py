from projects.models import Cliente
from rest_framework import viewsets, permissions
from projects.serializer.cliente_serializer import ClienteSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = ClienteSerializer

    def create(self, request, *args, **kwargs):
        print(f"Datos recibidos: {request.data}")  # Debug log
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            cliente = serializer.save()
            # Generar tokens JWT
            refresh = RefreshToken.for_user(cliente.user)
            return Response({
                'detail': 'Cliente registrado correctamente.',
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user_type': 'cliente',
                'user_data': {
                    'id': cliente.id,
                    'nombre': cliente.nombre,
                    'apellido': cliente.apellido,
                    'rut': cliente.rut,
                    'telefono': cliente.telefono,
                    'direccion': cliente.direccion
                }
            }, status=status.HTTP_201_CREATED)
        else:
            print(f"Errores de validación: {serializer.errors}")  # Debug log
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)