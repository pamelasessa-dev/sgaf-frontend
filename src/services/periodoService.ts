/**
 * periodoService.ts
 * Contiene las funciones para comunicarse con los endpoints
 * de períodos académicos del backend.
 */

import api from "./api";

import type {
  Periodo,
  CrearPeriodo,
  ActualizarPeriodo,
} from "../types/periodo";

// GET /periodos
// Obtiene todos los períodos académicos.
export async function obtenerPeriodos(): Promise<Periodo[]> {
  const { data } = await api.get<Periodo[]>("/periodos");

  return data;
}

// GET /periodos/:id
// Obtiene un período específico mediante su identificador.
export async function obtenerPeriodoPorId(id: number): Promise<Periodo> {
  const { data } = await api.get<Periodo>(`/periodos/${id}`);

  return data;
}

// POST /periodos
// Registra un nuevo período académico.
export async function crearPeriodo(datos: CrearPeriodo): Promise<Periodo> {
  const { data } = await api.post<Periodo>("/periodos", datos);

  return data;
}

// PATCH /periodos/:id
// Actualiza los datos de un período existente.
export async function actualizarPeriodo(
  id: number,
  datos: ActualizarPeriodo,
): Promise<Periodo> {
  const { data } = await api.patch<Periodo>(`/periodos/${id}`, datos);

  return data;
}

// DELETE /periodos/:id
// Elimina un período académico.
export async function eliminarPeriodo(id: number): Promise<void> {
  await api.delete(`/periodos/${id}`);
}

/**¿Qué hace este archivo?
- obtenerPeriodos(): devuelve la lista.
- obtenerPeriodoPorId(): busca un período.
- crearPeriodo(): registra uno nuevo.
- actualizarPeriodo(): modifica uno existente.
- eliminarPeriodo(): elimina un período.
 */
