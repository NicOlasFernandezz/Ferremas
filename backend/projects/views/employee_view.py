from projects.models import Empleado
from rest_framework import viewsets, permissions

class EmpleadoViewSet(viewsets.ModelViewSet):
    from projects.serializer.employee_serializer import EmpleadoSerializer
    
    queryset = Empleado.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = EmpleadoSerializer