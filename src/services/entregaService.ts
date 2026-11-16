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
 * Permite enviar respuesta escrita, archivo o ambos.
 */
export const crearEntrega = async (
  datos: CrearEntregaDto,
  archivo?: File,
): Promise<EntregaAcademica> => {
  const formulario = new FormData();

  formulario.append("id_actividad", String(datos.id_actividad));

  if (datos.respuesta_texto) {
    formulario.append("respuesta_texto", datos.respuesta_texto);
  }

  if (datos.archivo_url) {
    formulario.append("archivo_url", datos.archivo_url);
  }

  if (archivo) {
    formulario.append("archivo", archivo);
  }

  const respuesta = await api.post<EntregaAcademica>("/entregas", formulario);

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
