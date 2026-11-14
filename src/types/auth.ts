export type RolUsuario = "ADMIN" | "RECEPCIONISTA" | "PROFESOR" | "ESTUDIANTE";

export interface Usuario {
  id_usuario: number;
  email: string;
  rol: RolUsuario;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: Usuario;
}

/** Tipos para la gestión de autenticación 
 * Elemento	        *Función
RolUsuario	        Define los roles permitidos en el sistema.
Usuario	            Describe los datos del usuario autenticado.
LoginRequest	    Define los datos que enviamos al iniciar sesión.
LoginResponse	    Define la respuesta que recibimos del backend.
 * 
*/
