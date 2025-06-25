from rest_framework import routers
from projects.views import ProductoViewSet
from projects.views import EmpleadoViewSet
from projects.views import CargoViewSet
from projects.views import SucursalViewSet
from projects.views import ClienteViewSet
from projects.views import ContactoViewSet
from projects.views import EstadoOrdenViewSet
from projects.views import CambiarContrasenaView, CrearOrdenView, MercadoPagoWebhookView
from django.urls import path, include
from projects.views import PagoExitoso, PagoFallido, PagoPendiente


router = routers.DefaultRouter()
router.register('productos', ProductoViewSet, 'Productos')
router.register('empleados', EmpleadoViewSet, 'Empleados')
router.register('cargo', CargoViewSet, 'Cargo')
router.register('sucursal', SucursalViewSet, 'Sucursal')
router.register('clientes', ClienteViewSet, 'Clientes')
router.register('contacto', ContactoViewSet, 'Contacto')
router.register('estado-orden', EstadoOrdenViewSet, 'Estado-Orden')

urlpatterns = [ path('empleado/cambiar-contraseña/', CambiarContrasenaView.as_view(), name='Cambiar-Contraseña'),
                path('ordenes/crear/', CrearOrdenView.as_view(), name='crear-orden'),
                path('mercadopago/webhook/', MercadoPagoWebhookView.as_view(), name='mercadopago-webhook'),
                path('ordenes/pago_exitoso/', PagoExitoso, name='pago_exitoso'),
                path('ordenes/pago_fallido/', PagoFallido, name='pago_fallido'),
                path('ordenes/pago_pendiente/', PagoPendiente, name='pago_pendiente'),
                path('', include(router.urls))]