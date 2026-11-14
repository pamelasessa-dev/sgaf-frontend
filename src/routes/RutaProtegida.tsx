import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "../stores/authStore";
import type { RolUsuario } from "../types/auth";
import { rutasPorRol } from "./rutasPorRol";


interface RutaProtegidaProps {
  rolesPermitidos?: RolUsuario[];
}

export default function RutaProtegida({
  rolesPermitidos,
}: RutaProtegidaProps) {
  const token = useAuthStore((state) => state.token);
  const usuario = useAuthStore((state) => state.usuario);

  // Comprobar si existe una sesión.
  if (!token || !usuario) {
    return <Navigate to="/login" replace />;
  }

  // Comprobar si el rol tiene permiso.
  if (
    rolesPermitidos &&
    !rolesPermitidos.includes(usuario.rol)
  ) {
    return (
      <Navigate
        to={rutasPorRol[usuario.rol]}
        replace
      />
    );
  }

  return <Outlet />;
}

/**token: comprueba que exista un token de sesión.
 * usuario: comprueba que tengamos los datos del usuario.
 * rolesPermitidos: permite definir qué roles pueden acceder a una ruta.
 * Outlet: muestra la página protegida cuando se cumplen las condiciones.
 * Navigate: redirige cuando no se cumplen.
 * El backend también debe validar el token y los permisos; 
 * no podemos confiar únicamente en las rutas de React. 
*/