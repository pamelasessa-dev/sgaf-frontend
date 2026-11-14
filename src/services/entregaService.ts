/**
 * Servicio de entregas académicas.
 *
 * Centraliza las operaciones del endpoint /entregas.
 */

import api from "./api";

import type {
  CalificarEntregaDto,
  CrearEntregaDto,
  EntregaAcademica,
} from "../types/aulaVirtual";

/**
 * Crear una entrega como estudiante.
 *
 * Se admite una respuesta escrita, una URL de archivo
 * o ambas opciones.
 */
export const crearEntrega = async (
  datos: CrearEntregaDto,
): Promise<EntregaAcademica> => {
  const respuesta = await api.post<EntregaAcademica>("/entregas", datos);

  return respuesta.data;
};

/**
 * Consultar todas las entregas del estudiante autenticado.
 */
export const obtenerMisEntregas = async (): Promise<EntregaAcademica[]> => {
  const respuesta = await api.get<EntregaAcademica[]>("/entregas/me");

  return respuesta.data;
};

/**
 * Consultar las entregas de una actividad.
 * Solamente puede utilizarlo el profesor responsable.
 */
export const obtenerEntregasPorActividad = async (
  idActividad: number,
): Promise<EntregaAcademica[]> => {
  const respuesta = await api.get<EntregaAcademica[]>(
    `/entregas/actividad/${idActividad}`,
  );

  return respuesta.data;
};

/**
 * Calificar una entrega como profesor.
 */
export const calificarEntrega = async (
  idEntrega: number,
  datos: CalificarEntregaDto,
): Promise<EntregaAcademica> => {
  const respuesta = await api.post<EntregaAcademica>(
    `/entregas/${idEntrega}/calificar`,
    datos,
  );

  return respuesta.data;
};
