from django.db import models


class TipoEquipo(models.Model):
    nombre = models.CharField(max_length=100)
    vida_util_meses = models.IntegerField()
    frecuencia_mantenimiento_dias = models.IntegerField()

    class Meta:
        db_table = 'tipos_equipo'
        verbose_name = 'tipo de equipo'
        verbose_name_plural = 'Tipos de equipo'

    def __str__(self):
        return self.nombre

class Equipo(models.Model):

    codigo_inventario = models.CharField(
        max_length=20,
        unique=True
    )

    tipo_equipo = models.ForeignKey(
        TipoEquipo,
        on_delete=models.PROTECT,
        db_column='tipo_equipo_id'
    )

    marca = models.CharField(max_length=100)
    modelo = models.CharField(max_length=100)

    fecha_adquisicion = models.DateField()
    costo_adquisicion = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    estado = models.CharField(max_length=30)

    ram_gb = models.IntegerField()
    almacenamiento_gb = models.IntegerField()
    tipo_almacenamiento = models.CharField(max_length=50)
    nivel_cpu = models.IntegerField()

    salud_bateria = models.IntegerField()

    ultima_fecha_mantenimiento = models.DateField(
        null=True,
        blank=True
    )

    proxima_fecha_mantenimiento = models.DateField(
        null=True,
        blank=True
    )

    contiene_datos = models.BooleanField(default=False)

    class Meta:
        db_table = 'equipos'
        verbose_name = 'equipo'
        verbose_name_plural = 'Equipos'

    def __str__(self):
        return self.codigo_inventario

class Asignacion(models.Model):

    equipo = models.ForeignKey(
        Equipo,
        on_delete=models.PROTECT,
        db_column='equipo_id'
    )

    colaborador = models.ForeignKey(
        'usuarios.Usuario',
        on_delete=models.PROTECT,
        db_column='colaborador_id'
    )

    fecha_inicio = models.DateField()
    fecha_fin = models.DateField(
        null=True,
        blank=True
    )

    vigente = models.BooleanField(default=True)

    class Meta:
        db_table = 'asignaciones'
        verbose_name = 'asignación'
        verbose_name_plural = 'Asignaciones'

    def __str__(self):
        return f'{self.equipo.codigo_inventario} - {self.colaborador}'