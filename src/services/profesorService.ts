//profesorService.ts: conecta con los cinco endpoints del backend.

import api from "./api";
import type {
  Profesor,
  CrearProfesor,
  ActualizarProfesor,
} from "../types/profesor";

// Obtener todos los profesores.
export async function obtenerProfesores(): Promise<Profesor[]> {
  const { data } = await api.get<Profesor[]>("/profesores");
  return data;
}

// Obtener un profesor por su ID.
export async function obtenerProfesorPorId(id: number): Promise<Profesor> {
  const { data } = await api.get<Profesor>(`/profesores/${id}`);
  return data;
}

// Crear un profesor.
export async function crearProfesor(
  datosProfesor: CrearProfesor,
): Promise<Profesor> {
  const { data } = await api.post<Profesor>(
    "/profesores", 
    datosProfesor
  );
  
  return data;
}

// Actualizar un profesor.
export async function actualizarProfesor(
  id: number,
  datosProfesor: ActualizarProfesor,
): Promise<Profesor> {
  const { data } = await api.patch<Profesor>(
    `/profesores/${id}`,
    datosProfesor,
  );
  return data;
}

// Eliminar un profesor.
export async function eliminarProfesor(id: number): Promise<void> {
  await api.delete(`/profesores/${id}`);
}
