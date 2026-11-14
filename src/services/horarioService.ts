/**
 * horarioService.ts
 *
 * Contiene las funciones para comunicarse con los endpoints
 * de horarios académicos del backend.
 */

import api from "./api";

import type {
  Horario,
  CrearHorario,
  ActualizarHorario,
} from "../types/horario";

// GET /horarios
// Obtiene todos los horarios registrados.
export async function obtenerHorarios(): Promise<Horario[]> {
  const { data } = await api.get<Horario[]>("/horarios");

  return data;
}

// GET /horarios/:id
// Obtiene un horario mediante su identificador.
export async function obtenerHorarioPorId(id: number): Promise<Horario> {
  const { data } = await api.get<Horario>(`/horarios/${id}`);

  return data;
}

// POST /horarios
// Registra un horario para un grupo.
export async function crearHorario(datos: CrearHorario): Promise<Horario> {
  const { data } = await api.post<Horario>("/horarios", datos);

  return data;
}

// PATCH /horarios/:id
// Actualiza el día y las horas de un horario.
export async function actualizarHorario(
  id: number,
  datos: ActualizarHorario,
): Promise<Horario> {
  const { data } = await api.patch<Horario>(`/horarios/${id}`, datos);

  return data;
}

// DELETE /horarios/:id
// Elimina un horario.
export async function eliminarHorario(id: number): Promise<void> {
  await api.delete(`/horarios/${id}`);
}
