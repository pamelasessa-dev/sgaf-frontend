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
  ],

  RECEPCIONISTA: [
    { to: "/recepcion", etiqueta: "Panel", fin: true },
    { to: "/recepcion/perfil", etiqueta: "Mi perfil" },
    { to: "/usuarios", etiqueta: "Usuarios" },
  ],
  PROFESOR: [
    { to: "/profesor", etiqueta: "Panel", fin: true },
    { to: "/profesor/aula-virtual", etiqueta: "Aula Virtual" },
    { to: "/profesor/perfil", etiqueta: "Mi perfil" },
  ],

  ESTUDIANTE: [
    { to: "/estudiante", etiqueta: "Panel", fin: true },
    { to: "/estudiante/aula-virtual", etiqueta: "Aula Virtual" },
    { to: "/estudiante/perfil", etiqueta: "Mi perfil" },
  ],
};

export function useMenuPorRol(rol: RolUsuario | undefined) {
  return useMemo(() => (rol ? MENUS[rol] : []), [rol]);
}
