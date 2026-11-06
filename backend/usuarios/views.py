from rest_framework import viewsets
from .permissions import IsAdministradorTI


from .models import Rol, Area, PerfilPuesto, Usuario
from .serializers import (
    RolSerializer,
    AreaSerializer,
    PerfilPuestoSerializer,
    UsuarioSerializer
)


class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer
    permission_classes = [IsAdministradorTI]


class AreaViewSet(viewsets.ModelViewSet):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer
    permission_classes = [IsAdministradorTI]


class PerfilPuestoViewSet(viewsets.ModelViewSet):
    queryset = PerfilPuesto.objects.all()
    serializer_class = PerfilPuestoSerializer
    permission_classes = [IsAdministradorTI]


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAdministradorTI]

    def get_queryset(self):
        queryset = super().get_queryset()

        area_id = self.request.query_params.get('area')

        if area_id:
            queryset = queryset.filter(area_id=area_id)

        return queryset

    