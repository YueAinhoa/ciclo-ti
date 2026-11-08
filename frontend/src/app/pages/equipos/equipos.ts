
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Api } from '../../core/services/api';
import { Equipo } from '../../models/equipo.model';
import { TipoEquipo } from '../../models/tipo-equipo.model';

@Component({
  selector: 'app-equipos',
  imports: [FormsModule],
  templateUrl: './equipos.html',
  styleUrl: './equipos.scss'
})
export class Equipos implements OnInit {

  equipos: Equipo[] = [];
  tipos: TipoEquipo[] = [];

  codigo_inventario = '';
  tipo_equipo: number | null = null;
  marca = '';
  modelo = '';
  fecha_adquisicion = '';
  costo_adquisicion = 0;
  estado = 'Activo';
  ram_gb = 8;
  almacenamiento_gb = 256;
  tipo_almacenamiento = 'SSD';
  nivel_cpu = 3;
  salud_bateria = 100;
  contiene_datos = false;

  equipoSeleccionado: number | null = null;

  estados = ['Activo', 'En mantenimiento', 'Baja solicitada', 'Dado de baja'];

  cargando = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private api: Api,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.obtenerTipos();
    this.obtenerEquipos();
  }

  obtenerTipos(): void {
    this.api.getAll<TipoEquipo[]>('tipos-equipo').subscribe({
      next: data => {
        this.tipos = data;
        this.cdr.detectChanges();
      }
    });
  }

  obtenerEquipos(): void {
    this.cargando = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.api.getAll<Equipo[]>('equipos').subscribe({
      next: data => {
        this.equipos = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar los equipos.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  guardarEquipo(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.codigo_inventario.trim() ||
      !this.tipo_equipo ||
      !this.marca.trim() ||
      !this.modelo.trim() ||
      !this.fecha_adquisicion ||
      this.costo_adquisicion <= 0
    ) {
      this.errorMessage = 'Completa los campos obligatorios y verifica el costo.';
      return;
    }

    const datos = {
      codigo_inventario: this.codigo_inventario.trim().toUpperCase(),
      tipo_equipo: this.tipo_equipo,
      marca: this.marca.trim(),
      modelo: this.modelo.trim(),
      fecha_adquisicion: this.fecha_adquisicion,
      costo_adquisicion: this.costo_adquisicion,
      estado: this.estado,
      ram_gb: this.ram_gb,
      almacenamiento_gb: this.almacenamiento_gb,
      tipo_almacenamiento: this.tipo_almacenamiento,
      nivel_cpu: this.nivel_cpu,
      salud_bateria: this.salud_bateria,
      contiene_datos: this.contiene_datos
    };

    this.cargando = true;

    const peticion = this.equipoSeleccionado
      ? this.api.partialUpdate<Equipo>(
          'equipos',
          this.equipoSeleccionado,
          datos
        )
      : this.api.create<Equipo>('equipos', datos);

    peticion.subscribe({
      next: () => {
        this.successMessage = this.equipoSeleccionado
          ? 'Equipo actualizado correctamente.'
          : 'Equipo registrado correctamente.';

        this.limpiarFormulario();
        this.obtenerEquipos();
      },
      error: error => {
        this.cargando = false;
        this.errorMessage = error.status === 400
          ? 'No se pudo guardar. Verifica el código, las fechas y los valores ingresados.'
          : 'Ocurrió un error al guardar el equipo.';
        this.cdr.detectChanges();
      }
    });
  }

  editarEquipo(equipo: Equipo): void {
    this.equipoSeleccionado = equipo.id;

    this.codigo_inventario = equipo.codigo_inventario;
    this.tipo_equipo = equipo.tipo_equipo;
    this.marca = equipo.marca;
    this.modelo = equipo.modelo;
    this.fecha_adquisicion = equipo.fecha_adquisicion;
    this.costo_adquisicion = Number(equipo.costo_adquisicion);
    this.estado = equipo.estado;
    this.ram_gb = equipo.ram_gb;
    this.almacenamiento_gb = equipo.almacenamiento_gb;
    this.tipo_almacenamiento = equipo.tipo_almacenamiento;
    this.nivel_cpu = equipo.nivel_cpu;
    this.salud_bateria = equipo.salud_bateria;
    this.contiene_datos = equipo.contiene_datos;

    this.errorMessage = '';
    this.successMessage = '';
  }

  eliminarEquipo(id: number): void {
    if (!window.confirm('¿Deseas eliminar este equipo?')) return;

    this.cargando = true;
    this.api.delete('equipos', id).subscribe({
      next: () => {
        this.successMessage = 'Equipo eliminado correctamente.';
        this.obtenerEquipos();
      },
      error: () => {
        this.errorMessage = 'No se pudo eliminar. El equipo puede tener asignaciones asociadas.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  nombreTipo(id: number): string {
    return this.tipos.find(tipo => tipo.id === id)?.nombre || 'No encontrado';
  }

  limpiarFormulario(): void {
    this.codigo_inventario = '';
    this.tipo_equipo = null;
    this.marca = '';
    this.modelo = '';
    this.fecha_adquisicion = '';
    this.costo_adquisicion = 0;
    this.estado = 'Activo';
    this.ram_gb = 8;
    this.almacenamiento_gb = 256;
    this.tipo_almacenamiento = 'SSD';
    this.nivel_cpu = 3;
    this.salud_bateria = 100;
    this.contiene_datos = false;
    this.equipoSeleccionado = null;
  }
}
