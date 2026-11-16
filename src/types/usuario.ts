import type { RolUsuario } from "./auth";

export type EstadoUsuario = "PENDIENTE" | "ACTIVO" | "SUSPENDIDO" | "INACTIVO";

export interface UsuarioSistema {
  id_usuario: number;
  primer_nombre: string;
  segundo_nombre: string | null;
  primer_apellido: string;
  segundo_apellido: string | null;
  email: string;
  telefono: string | null;
  rol: RolUsuario;
  estado: EstadoUsuario;
  fecha_creacion: string;
  foto_perfil_url?: string | null;
}
export interface ActualizarMiPerfilRequest {
  primer_nombre?: string;
  segundo_nombre?: string | null;
  primer_apellido?: string;
  segundo_apellido?: string | null;
  telefono?: string | null;
}
