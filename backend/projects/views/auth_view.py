from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from projects.models import Empleado, Cliente
from django.contrib.auth.models import User


class LoginView(APIView):
    permission_classes = []
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({'error': 'Email y contraseña son requeridos'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Buscar usuario por email
            user = User.objects.get(email=email)
            
            # Autenticar usuario
            authenticated_user = authenticate(username=user.username, password=password)
            if not authenticated_user:
                return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)
            
            # Determinar tipo de usuario
            user_type = None
            user_data = {}
            
            try:
                empleado = Empleado.objects.get(user=user)
                user_type = 'empleado'
                user_data = {
                    'id': empleado.id,
                    'nombre': empleado.nombre,
                    'apellido': empleado.apellido,
                    'rut': empleado.rut,
                    'cargo': empleado.cargo.nombre if empleado.cargo else None,
                    'must_change_password': empleado.must_change_password
                }
            except Empleado.DoesNotExist:
                try:
                    cliente = Cliente.objects.get(user=user)
                    user_type = 'cliente'
                    user_data = {
                        'id': cliente.id,
                        'nombre': cliente.nombre,
                        'apellido': cliente.apellido,
                        'rut': cliente.rut,
                        'telefono': cliente.telefono,
                        'direccion': cliente.direccion
                    }
                except Cliente.DoesNotExist:
                    return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
            
            # Generar tokens JWT
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user_type': user_type,
                'user_data': user_data
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': 'Error interno del servidor'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
