from rest_framework import viewsets, permissions
from projects.serializer.estadoOrden_sz import EstadoOrdenSerializer
from ..models import Orden

class EstadoOrdenViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = EstadoOrdenSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.is_staff:  # empleados o administradores
            return Orden.objects.all()
        else:  # cliente
            return Orden.objects.filter(cliente=user)


