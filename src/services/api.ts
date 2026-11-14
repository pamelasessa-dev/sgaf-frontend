import axios from "axios";
import { useAuthStore } from "../stores/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Antes de cada petición, buscamos el token en Zustand.
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;

/** Instancia de Axios para las solicitudes HTTP 
 * Hasta ahora tenemos dos aplicaciones:
- Frontend: React, donde el usuario interactúa con botones, formularios y pantallas.
- Backend: NestJS, donde están las rutas, la lógica de negocio y la conexión con PostgreSQL.
Pero estas aplicaciones necesitan comunicarse.

Por ejemplo, cuando un administrador inicia sesión, React debe enviar su correo y contraseña al backend. El backend verifica los datos y devuelve un token.

Para realizar esa comunicación utilizaremos Axios.
 * 
axios.create()

Crea una instancia personalizada de Axios. En lugar de configurar cada solicitud individualmente, configuramos una sola vez los valores generales.

baseURL

Es la dirección base de nuestro backend.

headers

Indica que normalmente enviaremos información en formato JSON.

timeout

Establece un límite de 15 segundos para esperar una respuesta.

export default api

Permite importar esta instancia desde cualquier servicio del frontend.
*/
