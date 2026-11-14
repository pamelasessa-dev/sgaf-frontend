/**
 * erroresHttp.ts
 *
 * Traduce la respuesta de Axios a un mensaje que la pantalla puede mostrar.
 * No decide la navegación: el interceptor de api.ts separa 401 y 403.
 */

import axios from "axios";

const MENSAJE_POR_DEFECTO =
  "Ocurrió un error inesperado. Inténtalo nuevamente.";
const MENSAJE_SIN_CONEXION =
  "No se pudo conectar con el servidor. Comprueba que el backend esté en ejecución.";
const MENSAJE_TIMEOUT =
  "El servidor tardó demasiado en responder. Inténtalo de nuevo.";
const MENSAJE_401 =
  "Tu sesión no es válida o expiró. Vuelve a iniciar sesión.";
const MENSAJE_403 =
  "No tienes permiso para esta acción. Tu sesión sigue activa.";

function esRegistro(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

/** NestJS puede enviar `message` como texto o como lista de validaciones. */
function aTexto(valor: unknown): string | null {
  if (typeof valor === "string") {
    const texto = valor.trim();
    return texto === "" ? null : texto;
  }

  if (Array.isArray(valor)) {
    const textos = valor
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    return textos.length > 0 ? textos.join(". ") : null;
  }

  return null;
}

function mensajeDelBackend(data: unknown): string | null {
  if (typeof data === "string") return aTexto(data);
  if (Array.isArray(data)) return aTexto(data);
  if (!esRegistro(data)) return null;

  return aTexto(data.message) ?? aTexto(data.error);
}

/** Código HTTP de una respuesta Axios, o null si el fallo no llegó al servidor. */
export function codigoHttp(error: unknown): number | null {
  if (!axios.isAxiosError(error)) return null;
  return error.response?.status ?? null;
}

export function esNoAutorizado(error: unknown): boolean {
  return codigoHttp(error) === 401;
}

export function esAccesoDenegado(error: unknown): boolean {
  return codigoHttp(error) === 403;
}

/**
 * Prefiere el texto que envió NestJS.
 * Si no hay cuerpo, usa un mensaje distinto para 401 y para 403.
 */
export function extraerMensajeError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const mensaje = mensajeDelBackend(error.response?.data);
    if (mensaje) return mensaje;

    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return MENSAJE_TIMEOUT;
    }

    if (!error.response) return MENSAJE_SIN_CONEXION;

    if (error.response.status === 401) return MENSAJE_401;
    if (error.response.status === 403) return MENSAJE_403;

    return `El servidor respondió con un error (HTTP ${error.response.status}).`;
  }

  if (error instanceof Error && error.message.trim() !== "") {
    return error.message;
  }

  return MENSAJE_POR_DEFECTO;
}
