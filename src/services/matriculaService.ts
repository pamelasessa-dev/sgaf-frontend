/**
 * matriculaService.ts
 *
 * Centraliza las peticiones HTTP del módulo de matrículas.
 */

import api from "./api";

import type {
  CrearMatriculaDto,
  GrupoMatricula,
  Matricula,
} from "../types/matricula";

/**
 * Obtiene las matrículas del estudiante autenticado.
 * GET /matriculas/mis-matriculas
 */
export const obtenerMisMatriculas = async (): Promise<Matricula[]> => {
  const respuesta = await api.get<Matricula[]>("/matriculas/mis-matriculas");

  return respuesta.data;
};

/**
 * Obtiene todos los grupos académicos.
 * GET /grupos
 *
 * El filtrado de grupos abiertos y períodos activos
 * se realizará en la interfaz del estudiante.
 */
export const obtenerGruposDisponibles = async (): Promise<GrupoMatricula[]> => {
  const respuesta = await api.get<GrupoMatricula[]>("/grupos");

  return respuesta.data;
};

/**
 * Solicita una matrícula para el grupo seleccionado.
 * POST /matriculas
 *
 * El backend identifica al estudiante mediante su JWT.
 */
export const solicitarMatricula = async (
  datos: CrearMatriculaDto,
): Promise<Matricula> => {
  const respuesta = await api.post<Matricula>("/matriculas", datos);

  return respuesta.data;
};

/**
 * Activa una matrícula pendiente.
 * PATCH /matriculas/{id}/activar
 *
 * Esta operación está sujeta a los permisos del backend.
 */
export const activarMatricula = async (id: number): Promise<Matricula> => {
  const respuesta = await api.patch<Matricula>(`/matriculas/${id}/activar`);

  return respuesta.data;
};
