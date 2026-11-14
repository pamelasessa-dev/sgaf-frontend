import api from "./api";
import type {
  UsuarioSistema,
  EstadoUsuario,
  ActualizarMiPerfilRequest,
} from "../types/usuario";

// Obtener el perfil del usuario autenticado.
export async function obtenerMiPerfil(): Promise<UsuarioSistema> {
  const { data } = await api.get<UsuarioSistema>("/usuarios/me");
  return data;
}

// Actualizar los datos personales del usuario autenticado.
export async function actualizarMiPerfil(
  datos: ActualizarMiPerfilRequest,
): Promise<UsuarioSistema> {
  const { data } = await api.patch<UsuarioSistema>("/usuarios/me", datos);

  return data;
}

// Obtener todos los usuarios.
export async function obtenerUsuarios(): Promise<UsuarioSistema[]> {
  const { data } = await api.get<UsuarioSistema[]>("/usuarios");
  return data;
}

// Aprobar un postulante.
export async function aprobarPostulante(id: number) {
  const { data } = await api.patch(`/usuarios/${id}/aprobar`);

  return data;
}

// Actualizar el estado de un usuario.
export async function actualizarEstadoUsuario(
  id: number,
  estado: EstadoUsuario,
): Promise<UsuarioSistema> {
  const { data } = await api.patch<UsuarioSistema>(`/usuarios/${id}/estado`, {
    estado,
  });

  return data;
}

/**api: reutiliza nuestra instancia de Axios, que incorpora automáticamente el token.
 * GET /usuarios: solicita la lista al backend.
 * Promise<UsuarioSistema[]>: indica que esperamos una lista de usuarios.
 * return data: devuelve los datos para que los componentes React puedan utilizarlos.
 1. Aprobar postulante
- Recibe el ID del usuario.
- Envía PATCH /usuarios/:id/aprobar.
- No necesita cuerpo JSON.
- El backend activa al estudiante y genera su matrícula definitiva.
2. Actualizar estado
- Recibe el ID y el nuevo estado.
- Envía, por ejemplo, { estado: "SUSPENDIDO" }.
- Devuelve el usuario actualizado.*/
