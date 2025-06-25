from django.http import HttpResponse

def PagoPendiente(request):
    return HttpResponse("⏳ Su pago está pendiente de confirmación.")