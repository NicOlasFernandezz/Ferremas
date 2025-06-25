from projects.models import Producto
from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

class ProductoViewSet(viewsets.ModelViewSet):
    from projects.serializer.product_serializer import ProductoSerializer
    
    queryset = Producto.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = ProductoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['categoria', 'marca']

    @action(detail=False, methods=['get'], url_path='buscar-codigo/(?P<codigo_prod>\d+)')
    def buscar_por_codigo(self, request, codigo_prod=None):
        productos = Producto.objects.filter(codigo_prod=codigo_prod)
        if productos.exists():
            serializer = self.get_serializer(productos, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'error': 'No se encontró ningún producto con ese código.'}, status=status.HTTP_404_NOT_FOUND)