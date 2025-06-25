import re, os, django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sitemodule.settings')
django.setup()

from django.contrib.auth.models import User
from projects.models import Empleado

def limpiar_rut(rut):
    return re.sub(r'[^0-9kK]', '', rut).upper()

def asignar_user_a_empleados():
    empleados_sin_user = Empleado.objects.filter(user__isnull=True)
    for empleado in empleados_sin_user:
        username = ''.join(empleado.nombre.lower().split())
        base_username = username
        counter = 1

        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1
        
        password = limpiar_rut(empleado.rut)

        user = User.objects.create_user(username=username, password=password)
        user.save()

        empleado.user = user
        empleado.save()
        print(f"Asignado User '{username}' a empleado '{empleado.nombre}'")

asignar_user_a_empleados()
