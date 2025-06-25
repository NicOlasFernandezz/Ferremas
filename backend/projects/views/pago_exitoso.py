from django.http import HttpResponse

def PagoExitoso(request):
    return HttpResponse("✅ Pago exitoso. Gracias por su compra.")