/**
 * aulaService.ts
 *
 * Contiene las funciones para comunicarse con el backend
 * y realizar las operaciones CRUD de aulas.
 */

import api from "./api";

import type { Aula, CrearAula, ActualizarAula } from "../types/aula";

// Obtiene todas las aulas registradas.
export const obtenerAulas = async (): Promise<Aula[]> => {
  const respuesta = await api.get<Aula[]>("/aulas");

  return respuesta.data;
};

// Obtiene una aula específica mediante su ID.
export const obtenerAulaPorId = async (id: number): Promise<Aula> => {
  const respuesta = await api.get<Aula>(`/aulas/${id}`);

  return respuesta.data;
};

// Registra una nueva aula.
export const crearAula = async (datos: CrearAula): Promise<Aula> => {
  const respuesta = await api.post<Aula>("/aulas", datos);

  return respuesta.data;
};

// Actualiza los datos de una aula existente.
export const actualizarAula = async (
  id: number,
  datos: ActualizarAula,
): Promise<Aula> => {
  const respuesta = await api.patch<Aula>(`/aulas/${id}`, datos);

  return respuesta.data;
};

// Elimina una aula mediante su ID.
export const eliminarAula = async (id: number): Promise<void> => {
  await api.delete(`/aulas/${id}`);
};

/**¿Qué hace este servicio?
- obtenerAulas: consulta todas las aulas.
- obtenerAulaPorId: consulta una aula específica.
- crearAula: envía los datos mediante POST.
- actualizarAula: modifica los datos mediante PATCH.
- eliminarAula: elimina un registro mediante DELETE. */