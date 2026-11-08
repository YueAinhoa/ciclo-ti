import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Api } from '../../core/services/api';
import { Area } from '../../models/area.model';

@Component({
  selector: 'app-areas',
  imports: [FormsModule],
  templateUrl: './areas.html',
  styleUrl: './areas.scss'
})
export class Areas implements OnInit {

  areas: Area[] = [];

  nombre = '';
  descripcion = '';
  areaSeleccionada: number | null = null;

  cargando = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private api: Api,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.obtenerAreas();
  }

  obtenerAreas(): void {
    this.cargando = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.api.getAll<Area[]>('areas').subscribe({
      next: (data) => {
        this.areas = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar las áreas.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  guardarArea(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const datos = {
      nombre: this.nombre.trim(),
      descripcion: this.descripcion.trim()
    };

    if (!datos.nombre) {
      this.errorMessage = 'El nombre del área es obligatorio.';
      return;
    }

    this.cargando = true;

    const peticion = this.areaSeleccionada
      ? this.api.update<Area>('areas', this.areaSeleccionada, datos)
      : this.api.create<Area>('areas', datos);

    peticion.subscribe({
      next: () => {
        this.successMessage = this.areaSeleccionada
          ? 'Área actualizada correctamente.'
          : 'Área creada correctamente.';

        this.limpiarFormulario();
        this.obtenerAreas();
      },
      error: (error) => {
        this.cargando = false;
        this.errorMessage = error.status === 400
          ? 'No se pudo guardar. Verifica los datos ingresados.'
          : 'Ocurrió un error al guardar el área.';
        this.cdr.detectChanges();
      }
    });
  }

  editarArea(area: Area): void {
    this.areaSeleccionada = area.id;
    this.nombre = area.nombre;
    this.descripcion = area.descripcion;
    this.errorMessage = '';
    this.successMessage = '';
  }

  eliminarArea(area: Area): void {
    const confirmar = window.confirm(
      `¿Deseas eliminar el área "${area.nombre}"?`
    );

    if (!confirmar) return;

    this.cargando = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.api.delete('areas', area.id).subscribe({
      next: () => {
        this.successMessage = 'Área eliminada correctamente.';
        this.obtenerAreas();
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
    this.descripcion = '';
    this.areaSeleccionada = null;
  }
}