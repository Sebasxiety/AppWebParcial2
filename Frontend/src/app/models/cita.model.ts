export interface Cita {
  cita_id: number;
  paciente_id: number;
  paciente?: Paciente;
  doctor_id: number;
  doctor?: Doctor;
  fecha_hora_cita: string;
  motivo_consulta: string;
  estado: string;
}

export interface Paciente {
  paciente_id: number;
  nombre: string;
  apellido: string;
}

export interface Doctor {
  doctor_id: number;
  nombre: string;
  apellido: string;
  especialidad: string;
}
