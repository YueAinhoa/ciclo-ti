
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Api } from '../../core/services/api';
import { Asignacion } from '../../models/asignacion.model';
import { Area } from '../../models/area.model';
import { Usuario } from '../../models/usuario.model';
import { TipoEquipo } from '../../models/tipo-equipo.model';
import { Equipo } from '../../models/equipo.model';

@Component({
  selector: 'app-asignaciones',
  imports: [FormsModule],
  templateUrl: './asignaciones.html',
  styleUrl: './asignaciones.scss'
})
export class Asignaciones implements OnInit {

  asignaciones: Asignacion[] = [];
  areas: Area[] = [];
  colaboradores: Usuario[] = [];
  tipos: TipoEquipo[] = [];
  equipos: Equipo[] = [];

  areaSeleccionada: number | null = null;
  colaborador: number | null = null;
  tipoSeleccionado: number | null = null;
  equipo: number | null = null;

  fecha_inicio = '';
  asignacionSeleccionada: number | null = null;

  cargando = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private api: Api,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarCatalogos();
    this.cargarRoles();
    this.obtenerAsignaciones();
  }

  cargarCatalogos(): void {
    this.api.getAll<Area[]>('areas').subscribe({
      next: data => {
        this.areas = data;
        this.cdr.detectChanges();
      }
    });

    this.api.getAll<TipoEquipo[]>('tipos-equipo').subscribe({
      next: data => {
        this.tipos = data;
        this.cdr.detectChanges();
      }
    });
  }

  cargarColaboradores(): void {
    this.colaborador = null;
    this.colaboradores = [];

    if (!this.areaSeleccionada) {
      this.cdr.detectChanges();
      return;
    }

    this.api.getFiltered<Usuario[]>('usuarios', {
      area: String(this.areaSeleccionada)
    }).subscribe({
      next: data => {
        this.colaboradores = data.filter(
          usuario => usuario.is_active && this.rolesEsColaborador(usuario.rol)
        );
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar los colaboradores.';
        this.cdr.detectChanges();
      }
    });
  }

  rolesEsColaborador(id: number): boolean {
    const rol = this.roles.find(item => item.id === id);
    return rol?.nombre === 'Colaborador';
  }

  // Se cargan los roles para identificar a los colaboradores.
  roles: { id: number; nombre: string }[] = [];

  cargarRoles(): void {
    this.api.getAll<{ id: number; nombre: string }[]>('roles').subscribe({
      next: data => {
        this.roles = data;
        this.cdr.detectChanges();
      }
    });
  }

  cargarEquiposDisponibles(): void {
    this.equipo = null;
    this.equipos = [];

    if (!this.tipoSeleccionado) {
      this.cdr.detectChanges();
      return;
    }

    this.api.getFiltered<Equipo[]>('equipos', {
      tipo: String(this.tipoSeleccionado),
      disponibles: 'true'
    }).subscribe({
      next: data => {
        this.equipos = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar los equipos disponibles.';
        this.cdr.detectChanges();
      }
    });
  }

  obtenerAsignaciones(): void {
    this.cargando = true;
    this.cdr.detectChanges();

    this.api.getAll<Asignacion[]>('asignaciones').subscribe({
      next: data => {
        this.asignaciones = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar las asignaciones.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  guardarAsignacion(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.colaborador || !this.equipo || !this.fecha_inicio) {
      this.errorMessage = 'Completa todos los campos obligatorios.';
      return;
    }

    const datos = {
      colaborador: this.colaborador,
      equipo: this.equipo,
      fecha_inicio: this.fecha_inicio,
      fecha_fin: null,
      vigente: true
    };

    this.cargando = true;

    const peticion = this.asignacionSeleccionada
      ? this.api.partialUpdate<Asignacion>(
          'asignaciones',
          this.asignacionSeleccionada,
          datos
        )
      : this.api.create<Asignacion>('asignaciones', datos);

    peticion.subscribe({
      next: () => {
        this.successMessage = this.asignacionSeleccionada
          ? 'Asignación actualizada correctamente.'
          : 'Asignación registrada correctamente.';

        this.limpiarFormulario();
        this.obtenerAsignaciones();
      },
      error: error => {
        this.cargando = false;
        this.errorMessage = error.status === 400
          ? 'No se pudo guardar. Verifica que el equipo esté activo y no tenga otra asignación vigente.'
          : 'Ocurrió un error al guardar la asignación.';
        this.cdr.detectChanges();
      }
    });
  }

  editarAsignacion(asignacion: Asignacion): void {
    this.asignacionSeleccionada = asignacion.id;
    this.colaborador = asignacion.colaborador;
    this.equipo = asignacion.equipo;
    this.fecha_inicio = asignacion.fecha_inicio;

    this.errorMessage = '';
    this.successMessage = '';
  }

  eliminarAsignacion(id: number): void {
    if (!window.confirm('¿Deseas eliminar esta asignación?')) return;

    this.cargando = true;

    this.api.delete('asignaciones', id).subscribe({
      next: () => {
        this.successMessage = 'Asignación eliminada correctamente.';
        this.obtenerAsignaciones();
      },
      error: () => {
        this.errorMessage = 'No se pudo eliminar la asignación.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  limpiarFormulario(): void {
    this.areaSeleccionada = null;
    this.colaborador = null;
    this.tipoSeleccionado = null;
    this.equipo = null;
    this.fecha_inicio = '';
    this.asignacionSeleccionada = null;
    this.colaboradores = [];
    this.equipos = [];
  }
}
