/**
 * useMenuPorRol.ts
 *
 * Devuelve los enlaces que el rol autenticado puede ver.
 * La lista se memoriza: solo cambia cuando cambia el rol.
 */

import { useMemo } from "react";

import type { RolUsuario } from "../types/auth";

export interface EnlaceMenu {
  to: string;
  etiqueta: string;
  fin?: boolean;
}

const MENUS: Record<RolUsuario, EnlaceMenu[]> = {
  ADMIN: [
    { to: "/admin", etiqueta: "Panel", fin: true },
    { to: "/admin/perfil", etiqueta: "Mi perfil" },
    { to: "/usuarios", etiqueta: "Usuarios" },
    { to: "/admin/estudiantes", etiqueta: "Estudiantes" },
    { to: "/admin/profesores", etiqueta: "Profesores" },
    { to: "/admin/materias", etiqueta: "Materias" },
    { to: "/admin/periodos", etiqueta: "Períodos" },
    { to: "/admin/aulas", etiqueta: "Aulas" },
    { to: "/admin/grupos", etiqueta: "Grupos académicos" },
    { to: "/admin/horarios", etiqueta: "Horarios" },
    { to: "/admin/pagos", etiqueta: "Gestión de pagos" },
  ],

  RECEPCIONISTA: [
    { to: "/recepcion", etiqueta: "Panel", fin: true },
    { to: "/recepcion/perfil", etiqueta: "Mi perfil" },
    { to: "/usuarios", etiqueta: "Usuarios" },
    { to: "/recepcion/pagos", etiqueta: "Gestión de pagos" },
  ],

  PROFESOR: [
    { to: "/profesor", etiqueta: "Panel", fin: true },
    { to: "/profesor/perfil", etiqueta: "Mi perfil" },
    { to: "/profesor/aula-virtual", etiqueta: "Aula Virtual" },
  ],

  ESTUDIANTE: [
    { to: "/estudiante", etiqueta: "Panel", fin: true },
    { to: "/estudiante/perfil", etiqueta: "Mi perfil" },
    { to: "/estudiante/matriculas", etiqueta: "Mis matrículas" },
    { to: "/estudiante/aula-virtual", etiqueta: "Aula Virtual" },
    { to: "/estudiante/finanzas", etiqueta: "Finanzas" },
  ],
};

export function useMenuPorRol(rol: RolUsuario | undefined) {
  return useMemo(() => (rol ? MENUS[rol] : []), [rol]);
}
