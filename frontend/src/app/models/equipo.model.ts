
export interface Equipo {
  id: number;
  codigo_inventario: string;
  tipo_equipo: number;
  marca: string;
  modelo: string;
  fecha_adquisicion: string;
  costo_adquisicion: number;
  estado: string;
  ram_gb: number;
  almacenamiento_gb: number;
  tipo_almacenamiento: string;
  nivel_cpu: number;
  salud_bateria: number;
  ultima_fecha_mantenimiento: string | null;
  proxima_fecha_mantenimiento: string | null;
  contiene_datos: boolean;
}
