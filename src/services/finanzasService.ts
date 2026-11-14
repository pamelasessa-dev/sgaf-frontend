/**
 * finanzasService.ts
 *
 * Centraliza las peticiones HTTP del módulo financiero.
 * Incluye consultas de obligaciones y gestión de pagos.
 */

import api from "./api";

import type {
  CrearPagoDto,
  ObligacionFinanciera,
  PagoFinanciero,
  RechazarPagoDto,
} from "../types/matricula";

/**
 * Consulta las obligaciones financieras del estudiante autenticado.
 *
 * GET /obligaciones/me
 *
 * Disponible para: ESTUDIANTE.
 */
export const obtenerMisObligaciones = async (): Promise<
  ObligacionFinanciera[]
> => {
  const respuesta = await api.get<ObligacionFinanciera[]>("/obligaciones/me");

  return respuesta.data;
};

/**
 * Consulta una obligación financiera por su identificador.
 *
 * GET /obligaciones/:id
 *
 * Disponible para: ADMIN, RECEPCIONISTA.
 */
export const obtenerObligacionPorId = async (
  id: number,
): Promise<ObligacionFinanciera> => {
  const respuesta = await api.get<ObligacionFinanciera>(`/obligaciones/${id}`);

  return respuesta.data;
};

/**
 * Lista todos los pagos registrados.
 *
 * GET /pagos
 *
 * Disponible para: ADMIN, RECEPCIONISTA.
 */
export const obtenerPagos = async (): Promise<PagoFinanciero[]> => {
  const respuesta = await api.get<PagoFinanciero[]>("/pagos");

  return respuesta.data;
};

/**
 * Consulta un pago por su identificador.
 *
 * GET /pagos/:id
 *
 * Disponible para: ADMIN, RECEPCIONISTA.
 */
export const obtenerPagoPorId = async (id: number): Promise<PagoFinanciero> => {
  const respuesta = await api.get<PagoFinanciero>(`/pagos/${id}`);

  return respuesta.data;
};

/**
 * Registra un pago para una obligación financiera.
 *
 * POST /pagos
 *
 * Disponible para: ESTUDIANTE.
 *
 * Si el método es PASARELA, el backend puede devolver
 * checkout_url para redirigir al estudiante a MockPay.
 */
export const registrarPago = async (
  datos: CrearPagoDto,
): Promise<PagoFinanciero> => {
  const respuesta = await api.post<PagoFinanciero>("/pagos", datos);

  return respuesta.data;
};

/**
 * Aprueba un pago pendiente.
 *
 * PATCH /pagos/:id/aprobar
 *
 * Disponible para: ADMIN, RECEPCIONISTA.
 */
export const aprobarPago = async (id: number): Promise<PagoFinanciero> => {
  const respuesta = await api.patch<PagoFinanciero>(`/pagos/${id}/aprobar`);

  return respuesta.data;
};

/**
 * Rechaza un pago pendiente indicando el motivo.
 *
 * PATCH /pagos/:id/rechazar
 *
 * Disponible para: ADMIN, RECEPCIONISTA.
 */
export const rechazarPago = async (
  id: number,
  datos: RechazarPagoDto,
): Promise<PagoFinanciero> => {
  const respuesta = await api.patch<PagoFinanciero>(
    `/pagos/${id}/rechazar`,
    datos,
  );

  return respuesta.data;
};
