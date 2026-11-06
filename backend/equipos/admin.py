from django.contrib import admin
from .models import TipoEquipo, Equipo, Asignacion

admin.site.register(TipoEquipo)
admin.site.register(Equipo)
admin.site.register(Asignacion)