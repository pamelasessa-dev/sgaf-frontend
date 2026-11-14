/**
 * grupoService.ts
 *
 * Contiene las funciones para comunicarse con los endpoints
 * de grupos académicos del backend.
 */

import api from "./api";

import type { Grupo, CrearGrupo, ActualizarGrupo } from "../types/grupo";

// GET /grupos
// Obtiene todos los grupos académicos.
export async function obtenerGrupos(): Promise<Grupo[]> {
  const { data } = await api.get<Grupo[]>("/grupos");

  return data;
}

// GET /grupos/:id
// Obtiene un grupo específico mediante su identificador.
export async function obtenerGrupoPorId(id: number): Promise<Grupo> {
  const { data } = await api.get<Grupo>(`/grupos/${id}`);

  return data;
}

// POST /grupos
// Registra un nuevo grupo académico.
export async function crearGrupo(datos: CrearGrupo): Promise<Grupo> {
  const { data } = await api.post<Grupo>("/grupos", datos);

  return data;
}

// PATCH /grupos/:id
// Actualiza los campos que el backend permite modificar.
export async function actualizarGrupo(
  id: number,
  datos: ActualizarGrupo,
): Promise<Grupo> {
  const { data } = await api.patch<Grupo>(`/grupos/${id}`, datos);

  return data;
}

// DELETE /grupos/:id
// Elimina un grupo académico.
export async function eliminarGrupo(id: number): Promise<void> {
  await api.delete(`/grupos/${id}`);
}
