export interface Paciente {
  paciente_id: number;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string; // ISO date string
  telefono?: string;
}