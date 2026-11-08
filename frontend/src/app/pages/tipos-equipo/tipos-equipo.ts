import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Api } from '../../core/services/api';
import { TipoEquipo } from '../../models/tipo-equipo.model';

@Component({
  selector: 'app-tipos-equipo',
  imports: [FormsModule],
  templateUrl: './tipos-equipo.html',
  styleUrl: './tipos-equipo.scss'
})
export class TiposEquipo implements OnInit {

  tipos: TipoEquipo[] = [];

  nombre = '';
  vida_util_meses = 36;
  frecuencia_mantenimiento_dias = 180;

  tipoSeleccionado: number | null = null;

  cargando = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private api: Api,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.obtenerTipos();
  }

  obtenerTipos(): void {
    this.cargando = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.api.getAll<TipoEquipo[]>('tipos-equipo').subscribe({
      next: (data) => {
        this.tipos = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar los tipos de equipo.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  guardarTipo(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const datos = {
      nombre: this.nombre.trim(),
      vida_util_meses: this.vida_util_meses,
      frecuencia_mantenimiento_dias: this.frecuencia_mantenimiento_dias
    };

    if (!datos.nombre) {
      this.errorMessage = 'El nombre del tipo de equipo es obligatorio.';
      return;
    }

    this.cargando = true;

    const peticion = this.tipoSeleccionado
      ? this.api.update<TipoEquipo>(
          'tipos-equipo',
          this.tipoSeleccionado,
          datos
        )
      : this.api.create<TipoEquipo>('tipos-equipo', datos);

    peticion.subscribe({
      next: () => {
        this.successMessage = this.tipoSeleccionado
          ? 'Tipo de equipo actualizado correctamente.'
          : 'Tipo de equipo creado correctamente.';

        this.limpiarFormulario();
        this.obtenerTipos();
      },
      error: (error) => {
        this.cargando = false;
        this.errorMessage = error.status === 400
          ? 'No se pudo guardar. Verifica los datos ingresados.'
          : 'Ocurrió un error al guardar el tipo de equipo.';
        this.cdr.detectChanges();
      }
    });
  }

  editarTipo(tipo: TipoEquipo): void {
    this.tipoSeleccionado = tipo.id;
    this.nombre = tipo.nombre;
    this.vida_util_meses = tipo.vida_util_meses;
    this.frecuencia_mantenimiento_dias =
      tipo.frecuencia_mantenimiento_dias;

    this.errorMessage = '';
    this.successMessage = '';
  }

  eliminarTipo(tipo: TipoEquipo): void {
    const confirmar = window.confirm(
      `¿Deseas eliminar el tipo de equipo "${tipo.nombre}"?`
    );

    if (!confirmar) return;

    this.cargando = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.api.delete('tipos-equipo', tipo.id).subscribe({
      next: () => {
        this.successMessage = 'Tipo de equipo eliminado correctamente.';
        this.obtenerTipos();
      },
      error: () => {
        this.errorMessage =
          'No se pudo eliminar. Es posible que tenga equipos asociados.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  limpiarFormulario(): void {
    this.nombre = '';
    this.vida_util_meses = 36;
    this.frecuencia_mantenimiento_dias = 180;
    this.tipoSeleccionado = null;
  }
}