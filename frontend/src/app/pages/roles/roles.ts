
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Api } from '../../core/services/api';
import { Rol } from '../../models/rol.model';

@Component({
  selector: 'app-roles',
  imports: [FormsModule],
  templateUrl: './roles.html',
  styleUrl: './roles.scss'
})
export class Roles implements OnInit {

  roles: Rol[] = [];

  nombre = '';
  rolSeleccionado: number | null = null;

  cargando = false;
  errorMessage = '';
  successMessage = '';

  constructor(
  private api: Api,
  private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.obtenerRoles();
  }

  // Consultar todos los roles.
 obtenerRoles(): void {
    this.cargando = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.api.getAll<Rol[]>('roles').subscribe({
      next: (data) => {
        console.log('Roles recibidos:', data);

        this.roles = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar los roles.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Crear o actualizar un rol.
  guardarRol(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const nombreLimpio = this.nombre.trim();

    if (!nombreLimpio) {
      this.errorMessage = 'El nombre del rol es obligatorio.';
      return;
    }

    const datos = { nombre: nombreLimpio };

    this.cargando = true;

    const peticion = this.rolSeleccionado
      ? this.api.update<Rol>('roles', this.rolSeleccionado, datos)
      : this.api.create<Rol>('roles', datos);

    peticion.subscribe({
      next: () => {
        this.successMessage = this.rolSeleccionado
          ? 'Rol actualizado correctamente.'
          : 'Rol creado correctamente.';

        this.limpiarFormulario();
        this.obtenerRoles();
      },
      error: (error) => {
        this.cargando = false;

        this.errorMessage = error.status === 400
          ? 'No se pudo guardar. Verifica que el nombre sea válido o que no esté duplicado.'
          : 'Ocurrió un error al guardar el rol.';
      }
    });
  }

  // Cargar un rol en el formulario para editarlo.
  editarRol(rol: Rol): void {
    this.rolSeleccionado = rol.id;
    this.nombre = rol.nombre;
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Eliminar un rol.
  eliminarRol(rol: Rol): void {
    const confirmar = window.confirm(
      `¿Estás segura de que deseas eliminar el rol "${rol.nombre}"?`
    );

    if (!confirmar) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.cargando = true;

    this.api.delete('roles', rol.id).subscribe({
      next: () => {
        this.successMessage = 'Rol eliminado correctamente.';
        this.obtenerRoles();
      },
      error: () => {
        this.errorMessage =
          'No se pudo eliminar el rol. Es posible que tenga usuarios asociados.';
        this.cargando = false;
      }
    });
  }

  // Limpiar el formulario.
  limpiarFormulario(): void {
    this.nombre = '';
    this.rolSeleccionado = null;
  }
}
