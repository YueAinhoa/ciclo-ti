from rest_framework import viewsets
from usuarios.permissions import IsAdministradorTI

from .models import TipoEquipo, Equipo, Asignacion
from .serializers import (
    TipoEquipoSerializer,
    EquipoSerializer,
    AsignacionSerializer
)


class TipoEquipoViewSet(viewsets.ModelViewSet):
    queryset = TipoEquipo.objects.all()
    serializer_class = TipoEquipoSerializer
    permission_classes = [IsAdministradorTI]


class EquipoViewSet(viewsets.ModelViewSet):
    queryset = Equipo.objects.all()
    serializer_class = EquipoSerializer
    permission_classes = [IsAdministradorTI]

    def get_queryset(self):
        from django.db.models import Q

        queryset = super().get_queryset()

        tipo_id = self.request.query_params.get('tipo')
        disponibles = self.request.query_params.get('disponibles')

        if tipo_id:
            queryset = queryset.filter(tipo_equipo_id=tipo_id)

        if disponibles == 'true':
            queryset = queryset.filter(estado='Activo').exclude(
                asignacion__vigente=True
            )

        return queryset.distinct()

class AsignacionViewSet(viewsets.ModelViewSet):
    queryset = Asignacion.objects.all()
    serializer_class = AsignacionSerializer
    permission_classes = [IsAdministradorTI]
    