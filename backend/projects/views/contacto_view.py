from projects.models import Contacto
from rest_framework import viewsets, permissions
from projects.serializer.contacto_serializer import ContactoSerializer

class ContactoViewSet(viewsets.ModelViewSet):
    queryset = Contacto.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = ContactoSerializer