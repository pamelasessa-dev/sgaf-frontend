/**
 * aula.ts
 *
 * Define los tipos de datos del módulo de aulas.
 */

// Tipos de aula permitidos por el backend.
export type TipoAula = "FISICA" | "VIRTUAL";

// Estados permitidos para un aula.
export type EstadoAula = "DISPONIBLE" | "NO_DISPONIBLE";

// Representa un aula registrada en el sistema.
export interface Aula {
  id_aula: number;
  nombre: string;
  capacidad: number;
  ubicacion: string;
  tipo: TipoAula;
  estado: EstadoAula;
}

// Datos necesarios para crear un aula.
export interface CrearAula {
  nombre: string;
  capacidad: number;
  ubicacion: string;
  tipo: TipoAula;
  estado: EstadoAula;
}

// Datos permitidos para actualizar un aula.
// Los campos son opcionales porque utilizamos PATCH.
export interface ActualizarAula {
  nombre?: string;
  capacidad?: number;
  ubicacion?: string;
  tipo?: TipoAula;
  estado?: EstadoAula;
}
