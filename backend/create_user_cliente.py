import os, django, re

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sitemodule.settings')
django.setup()

from django.contrib.auth.models import User
from projects.models import Cliente

def generar_username(nombre):
    username = ''.join(nombre.lower().split())
    base_username = username
    counter = 1

    while User.objects.filter(username=username).exists():
        username = f"{base_username}{counter}"
        counter += 1
    return username

def asignar_user_a_clientes():
    clientes_sin_user = Cliente.objects.filter(user__isnull=True)

    for cliente in clientes_sin_user:
        username = generar_username(cliente.nombre)
        password = "contraseñaSegura123"

        user = User.objects.create_user(username=username, password=password)
        user.save()

        cliente.user = user
        cliente.save()
        print(f"Asignado User '{username}' a cliente '{cliente.nombre}'")

asignar_user_a_clientes()
