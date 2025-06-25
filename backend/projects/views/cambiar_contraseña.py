from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from projects.models.employees import Empleado
from projects.serializer.change_password_sz import ChangePasswordSerializer;

class CambiarContrasenaView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
                user = request.user
                new_password = serializer.validated_data['new_password']

                user.set_password(new_password)
                user.save()

                try:
                    empleado = Empleado.objects.get(user=user)
                    empleado.must_change_password = False
                    empleado.save()
                except Empleado.DoesNotExist:
                    pass

                return Response({'detail': 'Contraseña actualizada correctamente'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
