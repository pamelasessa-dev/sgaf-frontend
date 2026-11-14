import { useEffect, useState } from "react";
import { obtenerMiPerfil } from "../../../services/estudianteService";
import type { Estudiante } from "../../../types/estudiante";

export default function MiPerfilEstudiante() {
  const [perfil, setPerfil] = useState<Estudiante | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarPerfil() {
      try {
        const datos = await obtenerMiPerfil();
        setPerfil(datos);
      } catch (error) {
        console.error(error);
        setError("No se pudo cargar tu perfil.");
      } finally {
        setCargando(false);
      }
    }

    cargarPerfil();
  }, []);

  if (cargando) {
    return <p>Cargando tu perfil...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!perfil) {
    return <p>No se encontró información del estudiante.</p>;
  }

  const nombreCompleto = [
    perfil.usuario.primer_nombre,
    perfil.usuario.segundo_nombre,
    perfil.usuario.primer_apellido,
    perfil.usuario.segundo_apellido,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <main>
      <h1>Mi perfil</h1>

      <h2>Datos personales</h2>
      <p>Nombre: {nombreCompleto}</p>
      <p>Correo: {perfil.usuario.email}</p>
      <p>Teléfono: {perfil.usuario.telefono ?? "No registrado"}</p>
      <p>Estado: {perfil.usuario.estado}</p>

      <h2>Datos académicos</h2>
      <p>Matrícula: {perfil.nro_matricula}</p>
      <p>Fecha de nacimiento: {perfil.fecha_nacimiento}</p>
      <p>Fecha de ingreso: {perfil.fecha_ingreso}</p>
      <p>Dirección: {perfil.direccion ?? "No registrada"}</p>

      <h2>Datos del tutor</h2>
      <p>
        Nombre: {perfil.tutor.nombre} {perfil.tutor.apellido}
      </p>
      <p>Parentesco: {perfil.tutor.parentesco}</p>
      <p>Teléfono: {perfil.tutor.telefono}</p>
      <p>Correo: {perfil.tutor.email}</p>
    </main>
  );
}

/**
 * useEffect: ejecuta la consulta cuando se abre la página.
 * useState: guarda el perfil, el estado de carga y los errores.
 * obtenerMiPerfil(): consulta el endpoint /estudiantes/me.
 * perfil.usuario: accede a los datos del usuario asociado al estudiante.
 * finally: garantiza que termine el estado de carga tanto si la consulta funciona como si falla.
 */
