from projects.models import Cliente
from rest_framework import viewsets, permissions
from projects.serializer.cliente_serializer import ClienteSerializer
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = ClienteSerializer

    def post(self, request):
        serializer = ClienteSerializer(data=request.data)
        if serializer.is_valid():
            cliente = serializer.save()
            token = Token.objects.get(user=cliente.user)
            return Response({'detail': 'Cliente registrado correctamente.', "token": token.key}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)