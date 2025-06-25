from projects.models import Cargo
from rest_framework import viewsets, permissions

class CargoViewSet(viewsets.ModelViewSet):
    from projects.serializer.charge_serializer import CargoSerializer
    
    queryset = Cargo.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = CargoSerializer