/**
 * materia.ts
 * Define los tipos de datos utilizados en el módulo de materias.
 */

// Estados posibles de una materia según las respuestas del backend.
export type EstadoMateria = "ACTIVA" | "INACTIVA";

// Representa una materia recibida desde el backend.
export interface Materia {
  id_materia: number;
  nombre: string;
  descripcion: string;
  creditos: number;

  // El backend devuelve los costos como textos.
  costos_inscripcion: string;
  costo_mensual: string;

  estado: EstadoMateria;
}

// Datos necesarios para registrar una materia.
// Los costos se envían como números, según Swagger.
export interface CrearMateria {
  nombre: string;
  descripcion: string;
  creditos: number;
  costos_inscripcion: number;
  costo_mensual: number;
  estado: EstadoMateria;
}

// Datos permitidos al modificar una materia.
// Todos son opcionales porque PATCH permite cambios parciales.
export interface ActualizarMateria {
  nombre?: string;
  descripcion?: string;
  creditos?: number;
  costos_inscripcion?: number;
  costo_mensual?: number;
  estado?: EstadoMateria;
}

/**
 * ¿Qué hacemos aquí?
- EstadoMateria: evita escribir estados incorrectos.
- Materia: representa los datos que recibimos.
- CrearMateria: representa los datos que enviamos al registrar.
- ActualizarMateria: representa los cambios que enviamos al modificar.
 */