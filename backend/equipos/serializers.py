from rest_framework import serializers
from .models import TipoEquipo, Equipo, Asignacion


class TipoEquipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoEquipo
        fields = '__all__'


class EquipoSerializer(serializers.ModelSerializer):

    def validate_codigo_inventario(self, value):
        import re

        if not re.fullmatch(r'[A-Z]{3}-\d{3}', value):
            raise serializers.ValidationError(
                'El código debe tener el formato AAA-000, por ejemplo LAP-014.'
            )

        return value

    def validate_costo_adquisicion(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                'El costo de adquisición debe ser mayor que cero.'
            )

        return value

    def validate_fecha_adquisicion(self, value):
        from datetime import date

        if value > date.today():
            raise serializers.ValidationError(
                'La fecha de adquisición no puede ser futura.'
            )

        return value

    def validate_salud_bateria(self, value):
        if not 0 <= value <= 100:
            raise serializers.ValidationError(
                'La salud de la batería debe estar entre 0 y 100.'
            )

        return value

    class Meta:
        model = Equipo
        fields = '__all__'


class AsignacionSerializer(serializers.ModelSerializer):

    def validate(self, data):
        equipo = data.get('equipo')

        fecha_inicio = data.get(
            'fecha_inicio',
            getattr(self.instance, 'fecha_inicio', None)
        )

        fecha_fin = data.get(
            'fecha_fin',
            getattr(self.instance, 'fecha_fin', None)
        )

        vigente = data.get(
            'vigente',
            getattr(self.instance, 'vigente', True)
        )

        # Validar que el equipo esté activo
        if equipo and equipo.estado != 'Activo':
            raise serializers.ValidationError({
                'equipo': 'Solo se pueden asignar equipos en estado Activo.'
            })

        # Evitar dos asignaciones vigentes para el mismo equipo
        if equipo and vigente:
            asignaciones_existentes = Asignacion.objects.filter(
                equipo=equipo,
                vigente=True
            )

            # Excluir la asignación actual cuando se está editando
            if self.instance:
                asignaciones_existentes = asignaciones_existentes.exclude(
                    pk=self.instance.pk
                )

            if asignaciones_existentes.exists():
                raise serializers.ValidationError({
                    'equipo': 'Este equipo ya tiene una asignación vigente.'
                })

        # Validar fechas
        if fecha_inicio and fecha_fin and fecha_fin < fecha_inicio:
            raise serializers.ValidationError({
                'fecha_fin': 'La fecha de fin no puede ser anterior a la fecha de inicio.'
            })

        return data

    class Meta:
        model = Asignacion
        fields = '__all__'