
import api from "./api";
import type { Estudiante } from "../types/estudiante";

// Obtener todos los estudiantes.
export async function obtenerEstudiantes(): Promise<Estudiante[]> {
  const { data } = await api.get<Estudiante[]>("/estudiantes");

  return data;
}

// Obtener un estudiante por su ID.
export async function obtenerEstudiantePorId(
  id: number,
): Promise<Estudiante> {
  const { data } = await api.get<Estudiante>(`/estudiantes/${id}`);

  return data;
}

// Obtener el perfil del estudiante autenticado.
export async function obtenerMiPerfil(): Promise<Estudiante> {
  const { data } = await api.get<Estudiante>("/estudiantes/me");

  return data;
}
/* 
* api.get: realiza una petición HTTP GET utilizando nuestra configuración de Axios.
* Estudiante[]: indica que esperamos una lista de estudiantes.
* Estudiante: indica que esperamos un solo estudiante
* Promise: representa el resultado que recibiremos de forma asíncrona.
* data: contiene la respuesta del backend.
*/