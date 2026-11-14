/**
 * periodo.ts
 * Define los tipos de datos del módulo de períodos académicos.
 */

// Estados posibles según los datos devueltos por el backend.
export type EstadoPeriodo = "ACTIVO" | "PLANIFICADO" | "FINALIZADO";

// Representa un período recibido desde el backend.
export interface Periodo {
  id_periodo: number;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  limite_creditos: number;
  estado: EstadoPeriodo;
}

// Datos necesarios para registrar un período.
// Las fechas se envían como YYYY-MM-DD.
export interface CrearPeriodo {
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  limite_creditos: number;
  estado: EstadoPeriodo;
}

// Datos permitidos para modificar un período.
// Todos los campos son opcionales porque utilizamos PATCH.
export interface ActualizarPeriodo {
  nombre?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  limite_creditos?: number;
  estado?: EstadoPeriodo;
}
