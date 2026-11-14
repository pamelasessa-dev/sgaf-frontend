/**
 * materiaService.ts
 * Contiene las funciones que conectan el frontend
 * con los endpoints de materias del backend.
 */

import api from "./api";

import type {
  Materia,
  CrearMateria,
  ActualizarMateria,
} from "../types/materia";

// GET /materias
// Obtiene todas las materias registradas.
export async function obtenerMaterias(): Promise<Materia[]> {
  const { data } = await api.get<Materia[]>("/materias");
  return data;
}

// GET /materias/:id
// Obtiene una materia específica mediante su ID.
export async function obtenerMateriaPorId(id: number): Promise<Materia> {
  const { data } = await api.get<Materia>(`/materias/${id}`);
  return data;
}

// POST /materias
// Registra una nueva materia.
export async function crearMateria(datos: CrearMateria): Promise<Materia> {
  const { data } = await api.post<Materia>("/materias", datos);
  return data;
}

// PATCH /materias/:id
// Modifica los datos de una materia existente.
export async function actualizarMateria(
  id: number,
  datos: ActualizarMateria,
): Promise<Materia> {
  const { data } = await api.patch<Materia>(`/materias/${id}`, datos);
  return data;
}

// DELETE /materias/:id
// Elimina una materia mediante su ID.
export async function eliminarMateria(id: number): Promise<void> {
  await api.delete(`/materias/${id}`);
}
/**Ya tenemos conectadas las cinco operaciones del backend:
- Consultar todas las materias.
- Consultar una materia por ID.
- Registrar una materia.
- Actualizar una materia.
- Eliminar una materia. */