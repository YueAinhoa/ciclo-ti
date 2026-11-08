import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Api } from '../../core/services/api';
import { PerfilPuesto } from '../../models/perfil-puesto.model';

@Component({
  selector: 'app-perfiles-puesto',
  imports: [FormsModule],
  templateUrl: './perfiles-puesto.html',
  styleUrl: './perfiles-puesto.scss'
})
export class PerfilesPuesto implements OnInit {

  perfiles: PerfilPuesto[] = [];

  nombre = '';
  ram_minima_gb = 8;
  almacenamiento_minimo_gb = 256;
  nivel_cpu_minimo = 3;

  perfilSeleccionado: number | null = null;

  cargando = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private api: Api,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.obtenerPerfiles();
  }

  obtenerPerfiles(): void {
    this.cargando = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.api.getAll<PerfilPuesto[]>('perfiles-puesto').subscribe({
      next: (data) => {
        this.perfiles = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar los perfiles.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  guardarPerfil(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const datos = {
      nombre: this.nombre.trim(),
      ram_minima_gb: this.ram_minima_gb,
      almacenamiento_minimo_gb: this.almacenamiento_minimo_gb,
      nivel_cpu_minimo: this.nivel_cpu_minimo
    };

    if (!datos.nombre) {
      this.errorMessage = 'El nombre del perfil es obligatorio.';
      return;
    }

    this.cargando = true;

    const peticion = this.perfilSeleccionado
      ? this.api.update<PerfilPuesto>(
          'perfiles-puesto',
          this.perfilSeleccionado,
          datos
        )
      : this.api.create<PerfilPuesto>('perfiles-puesto', datos);

    peticion.subscribe({
      next: () => {
        this.successMessage = this.perfilSeleccionado
          ? 'Perfil actualizado correctamente.'
          : 'Perfil creado correctamente.';

        this.limpiarFormulario();
        this.obtenerPerfiles();
      },
      error: (error) => {
        this.cargando = false;
        this.errorMessage = error.status === 400
          ? 'No se pudo guardar. Verifica los datos ingresados.'
          : 'Ocurrió un error al guardar el perfil.';
        this.cdr.detectChanges();
      }
    });
  }

  editarPerfil(perfil: PerfilPuesto): void {
    this.perfilSeleccionado = perfil.id;
    this.nombre = perfil.nombre;
    this.ram_minima_gb = perfil.ram_minima_gb;
    this.almacenamiento_minimo_gb = perfil.almacenamiento_minimo_gb;
    this.nivel_cpu_minimo = perfil.nivel_cpu_minimo;

    this.errorMessage = '';
    this.successMessage = '';
  }

  eliminarPerfil(perfil: PerfilPuesto): void {
    const confirmar = window.confirm(
      `¿Deseas eliminar el perfil "${perfil.nombre}"?`
    );

    if (!confirmar) return;

    this.cargando = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.api.delete('perfiles-puesto', perfil.id).subscribe({
      next: () => {
        this.successMessage = 'Perfil eliminado correctamente.';
        this.obtenerPerfiles();
      },
      error: () => {
        this.errorMessage =
          'No se pudo eliminar. Es posible que tenga usuarios asociados.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  limpiarFormulario(): void {
    this.nombre = '';
    this.ram_minima_gb = 8;
    this.almacenamiento_minimo_gb = 256;
    this.nivel_cpu_minimo = 3;
    this.perfilSeleccionado = null;
  }
}