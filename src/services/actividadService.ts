/**
 * Servicio de actividades académicas.
 *
 * Centraliza las operaciones del endpoint /actividades.
 */

import api from "./api";

import type {
  ActividadAcademica,
  ActualizarActividadDto,
  CambiarEstadoActividadDto,
  CrearActividadDto,
} from "../types/aulaVirtual";

/**
 * Obtener las actividades de un grupo.
 */
export const obtenerActividadesPorGrupo = async (
  idGrupo: number,
): Promise<ActividadAcademica[]> => {
  const respuesta = await api.get<ActividadAcademica[]>(
    `/actividades/grupo/${idGrupo}`,
  );

  return respuesta.data;
};

/**
 * Obtener una actividad por su identificador.
 */
export const obtenerActividad = async (
  idActividad: number,
): Promise<ActividadAcademica> => {
  const respuesta = await api.get<ActividadAcademica>(
    `/actividades/${idActividad}`,
  );

  return respuesta.data;
};

/**
 * Crear una actividad académica.
 */
export const crearActividad = async (
  datos: CrearActividadDto,
): Promise<ActividadAcademica> => {
  const respuesta = await api.post<ActividadAcademica>("/actividades", datos);

  return respuesta.data;
};

/**
 * Actualizar una actividad en estado BORRADOR.
 */
export const actualizarActividad = async (
  idActividad: number,
  datos: ActualizarActividadDto,
): Promise<ActividadAcademica> => {
  const respuesta = await api.patch<ActividadAcademica>(
    `/actividades/${idActividad}`,
    datos,
  );

  return respuesta.data;
};

/**
 * Cambiar el estado de una actividad.
 */
export const cambiarEstadoActividad = async (
  idActividad: number,
  datos: CambiarEstadoActividadDto,
): Promise<ActividadAcademica> => {
  const respuesta = await api.patch<ActividadAcademica>(
    `/actividades/${idActividad}/estado`,
    datos,
  );

  return respuesta.data;
};
