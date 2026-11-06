from rest_framework.permissions import BasePermission


class IsAdministradorTI(BasePermission):
    """
    Permite el acceso únicamente a usuarios
    autenticados con el rol Administrador TI.
    """

    def has_permission(self, request, view):
        usuario = request.user

        return (
            usuario
            and usuario.is_authenticated
            and usuario.rol
            and usuario.rol.nombre == 'Administrador TI'
        )
    