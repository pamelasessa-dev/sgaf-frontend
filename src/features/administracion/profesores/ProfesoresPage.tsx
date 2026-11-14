//ProfesoresPage: muestra y administra el listado.

import { useEffect, useState } from "react";
import {
  obtenerProfesores,
  eliminarProfesor,
} from "../../../services/profesorService";
import type { Profesor } from "../../../types/profesor";
import ProfesorFormulario from "./ProfesorFormulario";
import ProfesorEditarFormulario from "./ProfesorEditarFormulario";

export default function ProfesoresPage() {
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  // Guarda el profesor que estamos seleccionando para editar.
  // Si es null, significa que no estamos editando a nadie.
  const [profesorSeleccionado, setProfesorSeleccionado] =
    useState<Profesor | null>(null);

  async function cargarProfesores() {
    try {
      setError("");
      const datos = await obtenerProfesores();
      setProfesores(datos);
    } catch (error) {
      console.error(error);
      setError("No se pudieron cargar los profesores.");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarProfesores();
  }, []);

  if (cargando) {
    return <p>Cargando profesores...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  // Elimina un profesor después de pedir confirmación.
  async function manejarEliminarProfesor(id: number) {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar este profesor?",
    );

    // Si el usuario cancela, no hacemos nada.
    if (!confirmar) return;

    try {
      // Solicitamos al backend que elimine al profesor.
      await eliminarProfesor(id);

      // Volvemos a cargar la lista para actualizar la tabla.
      await cargarProfesores();

      alert("Profesor eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar profesor:", error);

      alert("No se pudo eliminar el profesor. Puede tener grupos asociados.");
    }
  }

  return (
    <main>
      <h1>Gestión de profesores</h1>
      <h2>Registrar nuevo profesor</h2>
      <ProfesorFormulario onProfesorCreado={cargarProfesores} />
      {/* Si hay un profesor seleccionado, mostramos el formulario de edición. */}
      {profesorSeleccionado && (
        <section>
          <h2>Editar profesor</h2>

          <ProfesorEditarFormulario
            key={profesorSeleccionado.id_profesor}
            profesor={profesorSeleccionado}
            onProfesorActualizado={async () => {
              // Actualizamos la lista después de guardar los cambios.
              await cargarProfesores();

              // Cerramos el formulario de edición.
              setProfesorSeleccionado(null);
            }}
          />

          {/* Permite cerrar el formulario sin guardar cambios. */}
          <button type="button" onClick={() => setProfesorSeleccionado(null)}>
            Cancelar edición
          </button>
        </section>
      )}

      <p>Total de profesores: {profesores.length}</p>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre completo</th>
            <th>Correo</th>
            <th>Especialidad</th>
            <th>Fecha de contratación</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {profesores.map((profesor) => {
            const usuario = profesor.usuario;

            const nombre = [
              usuario.primer_nombre,
              usuario.segundo_nombre,
              usuario.primer_apellido,
              usuario.segundo_apellido,
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <tr key={profesor.id_profesor}>
                <td>{profesor.id_profesor}</td>
                <td>{nombre}</td>
                <td>{usuario.email}</td>
                <td>{profesor.especialidad}</td>
                <td>
                  {new Date(profesor.fecha_contratacion).toLocaleDateString(
                    "es-UY",
                  )}
                </td>
                <td>
                  {/* Permite seleccionar al profesor para modificarlo. */}
                  <button
                    type="button"
                    onClick={() => setProfesorSeleccionado(profesor)}
                  >
                    Editar
                  </button>

                  {/* Solicita confirmación antes de eliminar. */}
                  <button
                    type="button"
                    onClick={() =>
                      manejarEliminarProfesor(profesor.id_profesor)
                    }
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
