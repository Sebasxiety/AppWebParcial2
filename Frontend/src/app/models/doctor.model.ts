export interface Doctor {
  doctor_id: number;
  usuario_id: number;
  usuario?: Usuario;
  nombre: string;
  apellido: string;
  especialidad: string;
  telefono: string;
}

export interface Usuario {
  usuario_id: number;
  username: string;
  email: string;
  role: string;
}