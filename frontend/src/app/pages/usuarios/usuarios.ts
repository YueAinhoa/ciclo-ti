import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Api } from '../../core/services/api';
import { Usuario } from '../../models/usuario.model';
import { Rol } from '../../models/rol.model';
import { Area } from '../../models/area.model';
import { PerfilPuesto } from '../../models/perfil-puesto.model';

@Component({
  selector: 'app-usuarios',
  imports: [FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss'
})
export class Usuarios implements OnInit {

  usuarios: Usuario[] = [];
  roles: Rol[] = [];
  areas: Area[] = [];
  perfiles: PerfilPuesto[] = [];

  nombre = '';
  apellido = '';
  correo = '';
  password = '';

  rolSeleccionado: number | null = null;
  areaSeleccionada: number | null = null;
  perfilSeleccionado: number | null = null;

  is_active = true;
  usuarioSeleccionado: number | null = null;

  cargando = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private api: Api,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarCatalogos();
    this.obtenerUsuarios();
  }

  cargarCatalogos(): void {
    this.api.getAll<Rol[]>('roles').subscribe({
      next: data => {
        this.roles = data;
        this.cdr.detectChanges();
      }
    });

    this.api.getAll<Area[]>('areas').subscribe({
      next: data => {
        this.areas = data;
        this.cdr.detectChanges();
      }
    });

    this.api.getAll<PerfilPuesto[]>('perfiles-puesto').subscribe({
      next: data => {
        this.perfiles = data;
        this.cdr.detectChanges();
      }
    });
  }

  
  obtenerUsuarios(): void {
    this.cargando = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.api.getAll<Usuario[]>('usuarios').subscribe({
      next: data => {
        this.usuarios = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar los usuarios.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }


  guardarUsuario(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.nombre.trim() ||
      !this.apellido.trim() ||
      !this.correo.trim() ||
      !this.rolSeleccionado ||
      !this.areaSeleccionada ||
      !this.perfilSeleccionado
    ) {
      this.errorMessage = 'Completa todos los campos obligatorios.';
      return;
    }

    if (!this.usuarioSeleccionado && !this.password.trim()) {
      this.errorMessage = 'La contraseña es obligatoria para crear un usuario.';
      return;
    }

    const datos: any = {
      nombre: this.nombre.trim(),
      apellido: this.apellido.trim(),
      correo: this.correo.trim(),
      rol: this.rolSeleccionado,
      area: this.areaSeleccionada,
      perfil_puesto: this.perfilSeleccionado,
      is_active: this.is_active
    };

    if (this.password.trim()) {
      datos.password = this.password;
    }

    this.cargando = true;

    const peticion = this.usuarioSeleccionado
      ? this.api.partialUpdate<Usuario>(
          'usuarios',
          this.usuarioSeleccionado,
          datos
        )
      : this.api.create<Usuario>('usuarios', datos);

    peticion.subscribe({
      next: () => {
        this.successMessage = this.usuarioSeleccionado
          ? 'Usuario actualizado correctamente.'
          : 'Usuario creado correctamente.';

        this.limpiarFormulario();
        this.obtenerUsuarios();
      },
      error: error => {
        this.cargando = false;

        this.errorMessage = error.status === 400
          ? 'No se pudo guardar. Revisa los datos y verifica que el correo no esté registrado.'
          : 'Ocurrió un error al guardar el usuario.';

        this.cdr.detectChanges();
      }
    });
  }

  editarUsuario(usuario: Usuario): void {
    this.usuarioSeleccionado = usuario.id;

    this.nombre = usuario.nombre;
    this.apellido = usuario.apellido;
    this.correo = usuario.correo;

    this.rolSeleccionado = usuario.rol;
    this.areaSeleccionada = usuario.area;
    this.perfilSeleccionado = usuario.perfil_puesto;

    this.is_active = usuario.is_active;
    this.password = '';

    this.errorMessage = '';
    this.successMessage = '';
  }

  
  eliminarUsuario(id: number): void {
    const confirmar = window.confirm(
      '¿Deseas eliminar este usuario?'
    );

    if (!confirmar) return;

    this.cargando = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.api.delete('usuarios', id).subscribe({
      next: () => {
        this.successMessage = 'Usuario eliminado correctamente.';
        this.obtenerUsuarios();
      },
      error: () => {
        this.errorMessage =
          'No se pudo eliminar el usuario. Puede tener asignaciones asociadas.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  nombreRol(id: number): string {
    return this.roles.find(rol => rol.id === id)?.nombre || 'No encontrado';
  }

  nombreArea(id: number): string {
    return this.areas.find(area => area.id === id)?.nombre || 'No encontrada';
  }

  nombrePerfil(id: number): string {
    return this.perfiles.find(perfil => perfil.id === id)?.nombre || 'No encontrado';
  }

  limpiarFormulario(): void {
    this.nombre = '';
    this.apellido = '';
    this.correo = '';
    this.password = '';

    this.rolSeleccionado = null;
    this.areaSeleccionada = null;
    this.perfilSeleccionado = null;

    this.is_active = true;
    this.usuarioSeleccionado = null;
  }
}