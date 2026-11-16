import axios from "axios";
import { useAuthStore } from "../stores/authStore";
import { useAccesoStore } from "../stores/accesoStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Antes de cada petición, agregamos el token si existe.
api.interceptors.request.use(
  (config) => {
    // Si enviamos FormData, dejamos que el navegador configure
    // el Content-Type con su boundary correspondiente.
    if (config.data instanceof FormData) {
      config.headers.delete("Content-Type");
    }

    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Gestionamos los errores de autenticación y permisos.
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const estado = error.response?.status;

      if (estado === 401) {
        // La sesión ya no es válida.
        useAuthStore.getState().logout();
        useAccesoStore.getState().limpiar();
      }

      if (estado === 403) {
        // El usuario sigue autenticado, pero no tiene permiso.
        const respuesta = error.response?.data as
          | { message?: string | string[] }
          | undefined;

        const mensaje = Array.isArray(respuesta?.message)
          ? respuesta.message.join(". ")
          : respuesta?.message;

        useAccesoStore
          .getState()
          .mostrar(mensaje || "No tienes permiso para realizar esta acción.");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
