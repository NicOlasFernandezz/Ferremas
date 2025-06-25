from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import mercadopago
from django.conf import settings
from projects.models import Orden

class MercadoPagoWebhookView(APIView):
    authentication_classes = []  # Sin autenticación, público para Mercado Pago
    permission_classes = []

    def post(self, request):
        sdk = mercadopago.SDK(settings.MERCADOPAGO['ACCESS_TOKEN'])

        try:
            # Mercado Pago envía el id del recurso en request.data['id']
            payment_id = request.data.get('id', None)
            if not payment_id:
                return Response({"error": "payment id no encontrado"}, status=status.HTTP_400_BAD_REQUEST)

            # Obtener el detalle del pago
            payment_response = sdk.payment().get(payment_id)
            payment = payment_response["response"]

            # Obtener la orden con external_reference
            orden_id = int(payment.get("external_reference"))
            orden = Orden.objects.get(id=orden_id)

            status_pago = payment.get("status")

            if status_pago == "approved":
                orden.estado = "pagada"
                orden.transaccion_id = payment_id
                orden.save()
            elif status_pago == "pending":
                orden.estado = "pendiente"
                orden.save()
            else:
                orden.estado = "fallida"
                orden.save()

            return Response({"mensaje": "Notificación procesada correctamente"})

        except Orden.DoesNotExist:
            return Response({"error": "Orden no encontrada"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
