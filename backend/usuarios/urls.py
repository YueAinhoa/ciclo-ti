from rest_framework.routers import DefaultRouter
from .views import (
    RolViewSet,
    AreaViewSet,
    PerfilPuestoViewSet,
    UsuarioViewSet
)

router = DefaultRouter()

router.register('roles', RolViewSet)
router.register('areas', AreaViewSet)
router.register('perfiles-puesto', PerfilPuestoViewSet)
router.register('usuarios', UsuarioViewSet)

urlpatterns = router.urls
