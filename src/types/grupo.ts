/**
 * grupo.ts
 *
 * Define los tipos de datos utilizados en el módulo
 * de grupos académicos.
 */

import type { Materia } from "./materia";
import type { Periodo } from "./periodo";
import type { Profesor } from "./profesor";
import type { Aula } from "./aula";

// Estados permitidos para un grupo según el backend.
export type EstadoGrupo = "ABIERTO" | "CERRADO" | "FINALIZADO";

// Representa un grupo académico recibido desde el backend.
export interface Grupo {
  id_grupo: number;

  // Identificadores de las relaciones del grupo.
  id_materia: number;
  id_periodo: number;
  id_profesor: number;
  id_aula: number;

  nombre: string;
  cupo_maximo: number;
  estado: EstadoGrupo;

  // Relaciones que pueden venir incluidas en la respuesta del backend.
  materia?: Materia;
  periodo?: Periodo;
  profesor?: Profesor;
  aula?: Aula;
}

// Datos obligatorios para registrar un grupo.
export interface CrearGrupo {
  id_materia: number;
  id_periodo: number;
  id_profesor: number;
  id_aula: number;
  nombre: string;
  cupo_maximo: number;
  estado: EstadoGrupo;
}

// El backend actualmente solo aplica estos campos en PATCH.
export interface ActualizarGrupo {
  nombre?: string;
  cupo_maximo?: number;
  estado?: EstadoGrupo;
}
