
export interface Asignacion {
  id: number;
  equipo: number;
  colaborador: number;
  fecha_inicio: string;
  fecha_fin: string | null;
  vigente: boolean;
}
