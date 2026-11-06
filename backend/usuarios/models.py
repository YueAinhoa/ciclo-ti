from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class UsuarioManager(BaseUserManager):

    def create_user(self, correo, password=None, **extra_fields):
        if not correo:
            raise ValueError('El usuario debe tener un correo electrónico')

        correo = self.normalize_email(correo)
        usuario = self.model(correo=correo, **extra_fields)
        usuario.set_password(password)
        usuario.save(using=self._db)

        return usuario

    def create_superuser(self, correo, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        extra_fields.setdefault(
            'rol',
            Rol.objects.get(nombre='Administrador TI')
        )
        extra_fields.setdefault(
            'area',
            Area.objects.get(nombre='Tecnología')
        )
        extra_fields.setdefault(
            'perfil_puesto',
            PerfilPuesto.objects.get(nombre='Administrador TI')
        )

        if extra_fields.get('is_staff') is not True:
            raise ValueError('El superusuario debe tener is_staff=True')

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('El superusuario debe tener is_superuser=True')

        return self.create_user(correo, password, **extra_fields)

class Rol(models.Model):
    nombre = models.CharField(max_length=100)

    class Meta:
        db_table = 'roles'
        verbose_name = 'rol'
        verbose_name_plural = 'Roles'

    def __str__(self):
        return self.nombre


class Area(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()

    class Meta:
        db_table = 'areas'
        verbose_name = 'área'
        verbose_name_plural = 'Áreas'

    def __str__(self):
        return self.nombre


class PerfilPuesto(models.Model):
    nombre = models.CharField(max_length=100)
    ram_minima_gb = models.IntegerField()
    almacenamiento_minimo_gb = models.IntegerField()
    nivel_cpu_minimo = models.IntegerField()

    class Meta:
        db_table = 'perfiles_puesto'
        verbose_name = 'perfil de puesto'
        verbose_name_plural = 'Perfiles de puesto'

    def __str__(self):
        return self.nombre

class Usuario(AbstractBaseUser, PermissionsMixin):

    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    correo = models.EmailField(unique=True)

    password = models.CharField(
        max_length=128,
        db_column='password_hash'
    )

    rol = models.ForeignKey(
        Rol,
        on_delete=models.PROTECT,
        db_column='rol_id'
    )

    area = models.ForeignKey(
        Area,
        on_delete=models.PROTECT,
        db_column='area_id'
    )

    perfil_puesto = models.ForeignKey(
        PerfilPuesto,
        on_delete=models.PROTECT,
        db_column='perfil_puesto_id'
    )

    is_active = models.BooleanField(
        default=True,
        db_column='activo'
    )

    is_staff = models.BooleanField(default=False)

    objects = UsuarioManager()

    USERNAME_FIELD = 'correo'
    REQUIRED_FIELDS = ['nombre', 'apellido']

    class Meta:
        db_table = 'usuarios'
        verbose_name = 'usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return f'{self.nombre} {self.apellido}'

    