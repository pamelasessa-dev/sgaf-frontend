import type { RolUsuario } from "../types/auth";

export const rutasPorRol: Record<RolUsuario, string> = {
  ADMIN: "/admin",
  RECEPCIONISTA: "/recepcion",
  PROFESOR: "/profesor",
  ESTUDIANTE: "/estudiante",
};

/**
 * Las claves deben ser roles válidos de nuestro sistema.
 * Cada rol debe tener una ruta de tipo string.
 * No podemos olvidarnos de ningún rol.
 */
