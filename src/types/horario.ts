/**
 * horario.ts
 *
 * Define los tipos de datos utilizados en el módulo
 * de horarios académicos.
 */

import type { Grupo } from "./grupo";

// Días permitidos para programar clases.
export type DiaSemana =
  | "LUNES"
  | "MARTES"
  | "MIERCOLES"
  | "JUEVES"
  | "VIERNES"
  | "SABADO"
  | "DOMINGO";

// Representa un horario registrado en el backend.
export interface Horario {
  id_horario: number;
  id_grupo: number;
  dia_semana: DiaSemana;

  // El backend devuelve las horas como fechas ISO.
  hora_inicio: string;
  hora_fin: string;

  // Información del grupo asociado.
  grupo?: Grupo;
}

// Datos necesarios para crear un horario.
// El backend recibe las horas en formato HH:mm.
export interface CrearHorario {
  id_grupo: number;
  dia_semana: DiaSemana;
  hora_inicio: string;
  hora_fin: string;
}

// Campos que permite modificar el endpoint PATCH.
export interface ActualizarHorario {
  dia_semana?: DiaSemana;
  hora_inicio?: string;
  hora_fin?: string;
}
