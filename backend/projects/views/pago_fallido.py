from django.http import HttpResponse

def PagoFallido(request):
    return HttpResponse("❌ El pago ha fallado. Intente nuevamente.")