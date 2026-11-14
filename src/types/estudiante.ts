export type EstadoUsuario = "ACTIVO" | "PENDIENTE" | "INACTIVO";

export interface Tutor {
  id_tutor: number;
  nombre: string;
  apellido: string;
  parentesco: string;
  telefono: string;
  email: string;
  direccion: string;
}

export interface UsuarioEstudiante {
  id_usuario: number;
  email: string;
  estado: EstadoUsuario;
  rol: "ESTUDIANTE";
  primer_nombre: string;
  segundo_nombre: string | null;
  primer_apellido: string;
  segundo_apellido: string | null;
  telefono: string | null;
}

export interface Estudiante {
  id_estudiante: number;
  id_usuario: number;
  id_tutor: number;
  nro_matricula: string;
  fecha_nacimiento: string;
  direccion: string | null;
  fecha_ingreso: string;
  tutor: Tutor;
  usuario: UsuarioEstudiante;
}
