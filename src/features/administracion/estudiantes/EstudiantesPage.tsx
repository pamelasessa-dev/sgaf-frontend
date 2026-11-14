import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { obtenerEstudiantes } from "../../../services/estudianteService";
import type { Estudiante } from "../../../types/estudiante";

export default function EstudiantesPage() {
  const navigate = useNavigate();

  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");

  async function cargarEstudiantes() {
    try {
      setCargando(true);
      setError("");

      const datos = await obtenerEstudiantes();
      setEstudiantes(datos);
    } catch (error) {
      console.error("Error al cargar estudiantes:", error);
      setError("No se pudieron cargar los estudiantes. Intenta nuevamente.");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    void cargarEstudiantes();
  }, []);

  const obtenerNombreCompleto = (estudiante: Estudiante) =>
    [
      estudiante.usuario.primer_nombre,
      estudiante.usuario.segundo_nombre,
      estudiante.usuario.primer_apellido,
      estudiante.usuario.segundo_apellido,
    ]
      .filter(Boolean)
      .join(" ");

  const estudiantesFiltrados = estudiantes.filter((estudiante) => {
    const termino = busqueda.trim().toLowerCase();

    if (!termino) return true;

    const nombre = obtenerNombreCompleto(estudiante).toLowerCase();
    const correo = estudiante.usuario.email.toLowerCase();
    const matricula = estudiante.nro_matricula.toLowerCase();

    return (
      nombre.includes(termino) ||
      correo.includes(termino) ||
      matricula.includes(termino)
    );
  });

  const activos = estudiantes.filter(
    (estudiante) => estudiante.usuario.estado === "ACTIVO",
  ).length;

  const pendientes = estudiantes.filter(
    (estudiante) => estudiante.usuario.estado === "PENDIENTE",
  ).length;

  function obtenerClaseEstado(estado: string) {
    const clases: Record<string, string> = {
      ACTIVO: "bg-[#DDF3E5] text-[#328456]",
      PENDIENTE: "bg-[#FFF6C9] text-[#92721A]",
      INACTIVO: "bg-slate-100 text-slate-600",
      SUSPENDIDO: "bg-red-100 text-red-700",
    };

    return clases[estado] ?? "bg-slate-100 text-slate-600";
  }

  if (cargando) {
    return (
      <div className="flex min-h-[350px] flex-col items-center justify-center gap-4">
        <div className="h-11 w-11 animate-spin rounded-full border-4 border-[#DFF3FA] border-t-[#279EAA]" />
        <p className="text-sm font-medium text-slate-500">
          Cargando estudiantes...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="font-semibold text-red-700">{error}</p>
        <button
          type="button"
          onClick={() => void cargarEstudiantes()}
          className="mt-4 rounded-xl bg-[#279EAA] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#208894]"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <main className="space-y-7">
      {/* Encabezado */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#DFF3FA] via-[#E9F7F5] to-[#DDF3E5] p-6 sm:p-8">
        <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/40" />

        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-widest text-[#279EAA]">
            Administración / Estudiantes
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#192F4B]">
                Gestión de estudiantes
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                Consulta el registro académico, los datos personales y la
                información de contacto de los estudiantes.
              </p>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 text-3xl shadow-sm">
              🎓
            </div>
          </div>
        </div>
      </section>

      {/* Indicadores */}
      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-[#BDE8F1] bg-[#DFF3FA] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#236B91]">
              Total de estudiantes
            </p>
            <span className="text-2xl">👥</span>
          </div>
          <p className="mt-3 text-3xl font-bold text-[#236B91]">
            {estudiantes.length}
          </p>
          <p className="mt-1 text-xs text-[#236B91]/80">
            Registros encontrados
          </p>
        </article>

        <article className="rounded-2xl border border-[#A9DDBD] bg-[#DDF3E5] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#328456]">
              Estudiantes activos
            </p>
            <span className="text-2xl">✓</span>
          </div>
          <p className="mt-3 text-3xl font-bold text-[#328456]">{activos}</p>
          <p className="mt-1 text-xs text-[#328456]/80">Con estado activo</p>
        </article>

        <article className="rounded-2xl border border-[#F5D8A8] bg-[#FFF0D9] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#A76520]">Pendientes</p>
            <span className="text-2xl">⏳</span>
          </div>
          <p className="mt-3 text-3xl font-bold text-[#A76520]">{pendientes}</p>
          <p className="mt-1 text-xs text-[#A76520]/80">Requieren revisión</p>
        </article>
      </section>

      {/* Directorio */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-[#192F4B]">
              Directorio de estudiantes
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Busca estudiantes por nombre, correo o matrícula.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void cargarEstudiantes()}
            className="rounded-xl border border-[#BDE8F1] bg-[#DFF3FA] px-4 py-2.5 text-sm font-semibold text-[#236B91] transition hover:bg-[#BDE8F1]"
          >
            ↻ Actualizar
          </button>
        </div>

        <div className="border-b border-slate-100 bg-[#F4F7FA] p-5">
          <label
            htmlFor="buscar-estudiante"
            className="mb-2 block text-xs font-semibold text-slate-600"
          >
            Buscar estudiante
          </label>
          <input
            id="buscar-estudiante"
            type="search"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            placeholder="Nombre, correo o número de matrícula..."
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#279EAA] focus:ring-2 focus:ring-[#279EAA]/15"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 sm:px-6">
          <p className="text-xs text-slate-500">
            Mostrando{" "}
            <strong className="text-slate-700">
              {estudiantesFiltrados.length}
            </strong>{" "}
            de {estudiantes.length} estudiantes
          </p>

          {busqueda && (
            <button
              type="button"
              onClick={() => setBusqueda("")}
              className="text-xs font-semibold text-[#279EAA] hover:underline"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[850px] w-full text-left text-sm">
            <thead className="bg-[#F4F7FA] text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold sm:px-6">Matrícula</th>
                <th className="px-5 py-4 font-semibold">Estudiante</th>
                <th className="px-5 py-4 font-semibold">Correo electrónico</th>
                <th className="px-5 py-4 font-semibold">Tutor</th>
                <th className="px-5 py-4 font-semibold">Estado</th>
                <th className="px-5 py-4 text-center font-semibold">Detalle</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {estudiantesFiltrados.map((estudiante) => {
                const nombre = obtenerNombreCompleto(estudiante);

                return (
                  <tr
                    key={estudiante.id_estudiante}
                    className="transition hover:bg-[#F4F9FB]"
                  >
                    <td className="px-5 py-4 sm:px-6">
                      <span className="rounded-lg bg-[#DFF3FA] px-3 py-1.5 text-xs font-bold text-[#236B91]">
                        {estudiante.nro_matricula}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#279EAA] text-sm font-bold text-white">
                          {nombre.charAt(0).toUpperCase() || "E"}
                        </div>
                        <span className="font-semibold text-[#192F4B]">
                          {nombre}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {estudiante.usuario.email}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {estudiante.tutor
                        ? `${estudiante.tutor.nombre} ${estudiante.tutor.apellido}`
                        : "Sin tutor registrado"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${obtenerClaseEstado(estudiante.usuario.estado)}`}
                      >
                        {estudiante.usuario.estado}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/admin/estudiantes/${estudiante.id_estudiante}`,
                          )
                        }
                        className="rounded-xl bg-[#279EAA] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#208894]"
                      >
                        Ver detalle →
                      </button>
                    </td>
                  </tr>
                );
              })}

              {estudiantesFiltrados.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center">
                    <div className="text-4xl">🔎</div>
                    <p className="mt-3 font-semibold text-[#192F4B]">
                      No se encontraron estudiantes
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Probá con otro nombre, correo o matrícula.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 bg-[#F4F7FA] px-5 py-3">
          <p className="text-xs text-slate-400">
            Seleccioná «Ver detalle» para consultar la ficha completa del
            estudiante.
          </p>
        </div>
      </section>
    </main>
  );
}
