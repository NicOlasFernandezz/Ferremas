from projects.models import Sucursal
from rest_framework import viewsets, permissions
from projects.serializer.sucursal_serializer import SucursalSerializer

class SucursalViewSet(viewsets.ModelViewSet):
    queryset = Sucursal.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = SucursalSerializer