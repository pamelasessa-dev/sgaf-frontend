/**
 * accesoStore.ts
 *
 * Guarda el último acceso denegado (HTTP 403) para mostrarlo en pantalla.
 * No guarda el token y no cierra la sesión: eso solo ocurre con un 401.
 */

import { create } from "zustand";

interface AccesoState {
  mensaje: string | null;
  mostrar: (mensaje: string) => void;
  limpiar: () => void;
}

export const useAccesoStore = create<AccesoState>()((set) => ({
  mensaje: null,
  mostrar: (mensaje) => set({ mensaje }),
  limpiar: () => set({ mensaje: null }),
}));
