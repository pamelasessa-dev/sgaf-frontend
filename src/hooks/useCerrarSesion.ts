/**
 * Cierra la sesión guardada en Zustand y vuelve al login.
 * El callback se memoriza para pasarlo a botones sin recrearlo en cada render.
 */

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../stores/authStore";

export function useCerrarSesion() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  return useCallback(() => {
    logout();
    navigate("/login", { replace: true });
  }, [logout, navigate]);
}
