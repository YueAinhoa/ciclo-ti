from django.contrib import admin
from .models import Rol, Area, PerfilPuesto, Usuario

admin.site.site_header = 'CicloTI - Administración'
admin.site.site_title = 'CicloTI'
admin.site.index_title = 'Panel de gestión de TI'

admin.site.register(Rol)
admin.site.register(Area)
admin.site.register(PerfilPuesto)
admin.site.register(Usuario)