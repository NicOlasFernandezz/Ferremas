from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from projects.serializer.orden_sz import OrdenCrearSerializer
from django.conf import settings
import mercadopago
from django.http import HttpResponse

class CrearOrdenView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = OrdenCrearSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            orden = serializer.save()

            sdk = mercadopago.SDK(settings.MERCADOPAGO['ACCESS_TOKEN'])

            preference_data = {
                "items": [
                    {
                        "title": f"Orden #{orden.id}",
                        "quantity": 1,
                        "currency_id": "CLP",
                        "unit_price": float(orden.total)
                    }
                ],
                "back_urls": {
                    "success": "https://ae0d-2803-c600-5105-aa77-9daa-97d2-ac7a-3.ngrok-free.app/ordenes/pago_exitoso/",
                    "failure": "https://ae0d-2803-c600-5105-aa77-9daa-97d2-ac7a-3.ngrok-free.app/ordenes/pago_fallido/",
                    "pending": "https://ae0d-2803-c600-5105-aa77-9daa-97d2-ac7a-3.ngrok-free.app/ordenes/pago_pendiente/",
                },
                "auto_return": "approved",
                "external_reference": str(orden.id)
            }

            preference_response = sdk.preference().create(preference_data)
            preference = preference_response["response"]

            print("Respuesta de Mercado Pago:", preference_response)

            return Response({
                "orden_id": orden.id,
                "preference_id": preference["id"],
                "init_point": preference["init_point"]
            })

        print("Datos recibidos:", request.data)
        print("Errores del serializer:", serializer.errors)

        return Response({
            "error": "Datos inválidos",
            "detalle": serializer.errors
        }, status=400)