//profesor.ts: define la estructura de los datos.

export interface UsuarioProfesor {
  id_usuario: number;
  primer_nombre: string;
  segundo_nombre: string | null;
  primer_apellido: string;
  segundo_apellido: string | null;
  email: string;
  rol: "PROFESOR";
  estado: "ACTIVO" | "PENDIENTE" | "SUSPENDIDO" | "INACTIVO";
}

export interface Profesor {
  id_profesor: number;
  especialidad: string;
  fecha_contratacion: string;
  usuario: UsuarioProfesor;
}

// Datos necesarios para crear un profesor.
export interface CrearProfesor {
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  email: string;
  password: string;
  especialidad: string;
  fecha_contratacion: string;
}

// Datos permitidos para actualizar un profesor.
export interface ActualizarProfesor {
  primer_nombre?: string;
  segundo_nombre?: string | null;
  primer_apellido?: string;
  segundo_apellido?: string | null;
  email?: string;
  especialidad?: string;
  fecha_contratacion?: string;
}
