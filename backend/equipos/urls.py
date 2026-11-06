from rest_framework.routers import DefaultRouter

from .views import (
    TipoEquipoViewSet,
    EquipoViewSet,
    AsignacionViewSet
)

router = DefaultRouter()

router.register('tipos-equipo', TipoEquipoViewSet)
router.register('equipos', EquipoViewSet)
router.register('asignaciones', AsignacionViewSet)

urlpatterns = router.urls
