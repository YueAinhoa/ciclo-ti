from rest_framework import serializers
from .models import Rol, Area, PerfilPuesto, Usuario


class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = '__all__'


class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = '__all__'


class PerfilPuestoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerfilPuesto
        fields = '__all__'


class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Usuario
        fields = [
            'id',
            'nombre',
            'apellido',
            'correo',
            'password',
            'rol',
            'area',
            'perfil_puesto',
            'is_active'
        ]

    def create(self, validated_data):
        password = validated_data.pop('password')
        return Usuario.objects.create_user(
            password=password,
            **validated_data
        )

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)

        for atributo, valor in validated_data.items():
            setattr(instance, atributo, valor)

        if password:
            instance.set_password(password)

        instance.save()
        return instance 