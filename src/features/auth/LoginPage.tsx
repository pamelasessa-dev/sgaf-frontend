/**
 * LoginPage.tsx
 *
 * Gestiona el inicio de sesión:
 * - Llama al servicio de autenticación.
 * - Guarda el token y el usuario en Zustand.
 * - Redirige según el rol.
 * - Muestra los errores devueltos por el backend.
 */

import { useState } from "react";
import { codigoHttp, extraerMensajeError } from "../../lib/erroresHttp";
import { useNavigate } from "react-router-dom";

import LoginForm from "./LoginForm";
import type { LoginFormData } from "./LoginSchema";

import { login } from "../../services/authService";
import { useAuthStore } from "../../stores/authStore";
import { rutasPorRol } from "../../routes/rutasPorRol";

export default function LoginPage() {
  const navigate = useNavigate();

  const guardarSesion = useAuthStore((state) => state.login);

  const [errorLogin, setErrorLogin] = useState<string | null>(null);

  /**
   * Procesa las credenciales enviadas desde LoginForm.
   */
  const manejarLogin = async (datos: LoginFormData) => {
    setErrorLogin(null);

    try {
      const respuesta = await login(datos);

      // Guardamos el token y los datos del usuario.
      guardarSesion(respuesta.access_token, respuesta.user);

      // Redirigimos al panel correspondiente al rol.
      const ruta = rutasPorRol[respuesta.user.rol];

      if (!ruta) {
        setErrorLogin("El usuario no tiene una ruta de acceso configurada.");
        return;
      }

      navigate(ruta, { replace: true });
    } catch (error: unknown) {
      console.error("Error al iniciar sesión", error);

      const mensaje = extraerMensajeError(error);

      if (mensaje.toLowerCase().includes("el usuario no está activo")) {
        setErrorLogin(
          "Tu cuenta no está activa. Si se debe a una suspensión por mora, contactá a Recepción para regularizar tu situación.",
        );
      } else if (codigoHttp(error) === 401) {
        setErrorLogin("El correo o la contraseña son incorrectos.");
      } else {
        setErrorLogin(mensaje);
      }
    }
  };
  return <LoginForm alEnviar={manejarLogin} errorLogin={errorLogin} />;
}
