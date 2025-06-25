from rest_framework import serializers
from projects.models import Orden, OrdenItem, Cliente, Producto
from .ordenItem_sz import OrdenItemSerializer

class OrdenCrearSerializer(serializers.ModelSerializer):
    items = OrdenItemSerializer(many=True)
    cliente_rut = serializers.CharField(required=False)

    class Meta:
        model = Orden
        fields = ['id', 'items', 'cliente_rut']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        user = self.context['request'].user
        cliente_rut = validated_data.pop('cliente_rut', None)

        cliente = None
        if cliente_rut:
            try:
                cliente = Cliente.objects.get(rut=cliente_rut)
            except Cliente.DoesNotExist:
                raise serializers.ValidationError("Cliente con ese rut no existe.")
        else:
            try:
                cliente = Cliente.objects.get(user=user)
            except Cliente.DoesNotExist:
                raise serializers.ValidationError("Este usuario no está registrado como cliente y no se indicó uno.")


        orden = Orden.objects.create(cliente=cliente.user, total=0)
        total = 0



        for item_data in items_data:
            codigo_prod = item_data['codigo_prod']
            cantidad = int(item_data['cantidad']) 

            try:
                producto = Producto.objects.get(codigo_prod=codigo_prod)
            except Producto.DoesNotExist:
                raise serializers.ValidationError(f"Producto con código {codigo_prod} no existe")

            if producto.stock < cantidad:
                raise serializers.ValidationError(
                    f"Stock insuficiente para '{producto.nombre}': disponible {producto.stock}"
                )

            precio_unitario = producto.precio
            subtotal = precio_unitario * cantidad
            total += subtotal

            producto.stock -= cantidad
            producto.save()

            OrdenItem.objects.create(
                orden=orden,
                producto=producto,
                cantidad=cantidad,
                precio_unitario=precio_unitario
            )

        orden.total = total
        orden.save()
        return orden
