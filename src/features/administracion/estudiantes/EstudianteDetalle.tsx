import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { obtenerEstudiantePorId } from "../../../services/estudianteService";
import type { Estudiante } from "../../../types/estudiante";

export default function EstudianteDetalle() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [estudiante, setEstudiante] = useState<Estudiante | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarDetalle() {
      try {
        if (!id || !Number.isInteger(Number(id))) {
          throw new Error("Identificador inválido");
        }

        const datos = await obtenerEstudiantePorId(Number(id));
        setEstudiante(datos);
      } catch (error) {
        console.error("Error al consultar estudiante:", error);
        setError("No se pudo cargar el estudiante.");
      } finally {
        setCargando(false);
      }
    }

    cargarDetalle();
  }, [id]);

  const formatearFecha = (fecha: string | Date | null | undefined) => {
    if (!fecha) return "No registrada";

    const valor = new Date(fecha);

    if (Number.isNaN(valor.getTime())) return "No registrada";

    return valor.toLocaleDateString("es-UY", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  if (cargando) {
    return (
      <main className="flex min-h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#DFF3FA] border-t-[#279EAA]" />
          <p className="mt-4 text-sm font-medium text-slate-500">
            Cargando información del estudiante...
          </p>
        </div>
      </main>
    );
  }

  if (error || !estudiante) {
    return (
      <main className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h2 className="font-semibold text-red-800">
              No se pudo cargar la información
            </h2>
            <p className="mt-1 text-sm text-red-700">
              {error || "Estudiante no encontrado."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/estudiantes")}
          className="mt-5 rounded-xl bg-[#279EAA] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#218A95]"
        >
          Volver al listado
        </button>
      </main>
    );
  }

  const usuario = estudiante.usuario;

  const nombreCompleto = [
    usuario.primer_nombre,
    usuario.segundo_nombre,
    usuario.primer_apellido,
    usuario.segundo_apellido,
  ]
    .filter(Boolean)
    .join(" ");

  const iniciales = [usuario.primer_nombre, usuario.primer_apellido]
    .filter(Boolean)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join("");

  const estado = usuario.estado?.toUpperCase() || "SIN ESTADO";

  const estadoActivo = estado === "ACTIVO";

  return (
    <main className="space-y-6">
      {/* Encabezado de la página */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#279EAA]">
            Gestión académica / Estudiantes
          </p>

          <h1 className="mt-1 text-2xl font-bold text-[#192F4B] sm:text-3xl">
            Detalle del estudiante
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Información personal, académica y familiar.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/estudiantes")}
          className="inline-flex items-center gap-2 rounded-xl border border-[#BDE8F1] bg-white px-4 py-2.5 text-sm font-semibold text-[#236B79] shadow-sm transition hover:bg-[#DFF3FA]"
        >
          <span aria-hidden="true">←</span>
          Volver al listado
        </button>
      </div>

      {/* Identificación del estudiante */}
      <section className="overflow-hidden rounded-2xl bg-[#279EAA] shadow-md">
        <div className="relative p-6 sm:p-8">
          <div
            aria-hidden="true"
            className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[30px] border-white/10"
          />

          <div className="relative z-10 flex flex-wrap items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white/40 bg-white text-3xl font-bold text-[#279EAA] shadow-md">
              {iniciales || "ES"}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white/80">
                Ficha del estudiante
              </p>

              <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                {nombreCompleto}
              </h2>

              <p className="mt-2 break-all text-sm text-white/90">
                {usuario.email}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-lg border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                  Matrícula: {estudiante.nro_matricula}
                </span>

                <span
                  className={`rounded-lg px-3 py-1 text-xs font-bold ${
                    estadoActivo
                      ? "bg-white text-[#237849]"
                      : "bg-[#FFF0D9] text-[#92551D]"
                  }`}
                >
                  {estado}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tarjetas de resumen */}
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border border-[#BDE8F1] bg-[#DFF3FA] p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#279EAA] text-2xl text-white">
            📅
          </div>

          <div>
            <p className="text-xs font-medium text-[#236B79]">
              Fecha de ingreso
            </p>
            <p className="mt-1 font-bold text-[#192F4B]">
              {formatearFecha(estudiante.fecha_ingreso)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-[#A9DDBD] bg-[#DDF3E5] p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#328456] text-2xl text-white">
            🎓
          </div>

          <div>
            <p className="text-xs font-medium text-[#285C3D]">
              Matrícula académica
            </p>
            <p className="mt-1 font-bold text-[#285C3D]">
              {estudiante.nro_matricula}
            </p>
          </div>
        </div>
      </section>

      {/* Datos personales */}
      <section className="overflow-hidden rounded-2xl bg-[#236B91] shadow-md">
        <div className="flex items-center gap-3 border-b border-white/15 px-5 py-4 sm:px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-xl">
            👤
          </div>

          <div>
            <h2 className="font-bold text-white">Datos personales</h2>
            <p className="text-xs text-white/70">
              Información de contacto e identificación
            </p>
          </div>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <div>
            <p className="text-xs font-medium text-white/70">Nombre completo</p>
            <p className="mt-1 break-words font-semibold text-white">
              {nombreCompleto}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-white/70">
              Correo electrónico
            </p>
            <p className="mt-1 break-all font-semibold text-white">
              {usuario.email}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-white/70">Teléfono</p>
            <p className="mt-1 font-semibold text-white">
              {usuario.telefono || "No registrado"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-white/70">
              Estado del usuario
            </p>
            <p className="mt-1 font-semibold text-white">{estado}</p>
          </div>
        </div>
      </section>

      {/* Información académica */}
      <section className="overflow-hidden rounded-2xl bg-[#328456] shadow-md">
        <div className="flex items-center gap-3 border-b border-white/15 px-5 py-4 sm:px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-xl">
            🎓
          </div>

          <div>
            <h2 className="font-bold text-white">Información académica</h2>
            <p className="text-xs text-white/75">
              Datos de matrícula e ingreso
            </p>
          </div>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <div>
            <p className="text-xs font-medium text-white/75">
              Número de matrícula
            </p>
            <p className="mt-1 font-semibold text-white">
              {estudiante.nro_matricula}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-white/75">
              Fecha de nacimiento
            </p>
            <p className="mt-1 font-semibold text-white">
              {formatearFecha(estudiante.fecha_nacimiento)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-white/75">
              Fecha de ingreso
            </p>
            <p className="mt-1 font-semibold text-white">
              {formatearFecha(estudiante.fecha_ingreso)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-white/75">Dirección</p>
            <p className="mt-1 font-semibold text-white">
              {estudiante.direccion || "No registrada"}
            </p>
          </div>
        </div>
      </section>

      {/* Datos del tutor */}
      <section className="overflow-hidden rounded-2xl bg-[#C17A28] shadow-md">
        <div className="flex items-center gap-3 border-b border-white/15 px-5 py-4 sm:px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-xl">
            👨‍👩‍👧
          </div>

          <div>
            <h2 className="font-bold text-white">Datos del tutor</h2>
            <p className="text-xs text-white/75">
              Información del responsable del estudiante
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-4 rounded-xl bg-white/15 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-lg font-bold text-[#C17A28]">
              {[estudiante.tutor.nombre, estudiante.tutor.apellido]
                .filter(Boolean)
                .map((parte) => parte.charAt(0).toUpperCase())
                .join("")}
            </div>

            <div>
              <p className="text-xs text-white/75">Tutor responsable</p>
              <p className="font-bold text-white">
                {estudiante.tutor.nombre} {estudiante.tutor.apellido}
              </p>
              <p className="text-xs text-white/80">
                {estudiante.tutor.parentesco}
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-white/75">Parentesco</p>
              <p className="mt-1 font-semibold text-white">
                {estudiante.tutor.parentesco}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-white/75">Teléfono</p>
              <p className="mt-1 font-semibold text-white">
                {estudiante.tutor.telefono}
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-xs font-medium text-white/75">
                Correo electrónico
              </p>
              <p className="mt-1 break-all font-semibold text-white">
                {estudiante.tutor.email}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Volver al listado */}
      <div className="flex justify-end pb-2">
        <button
          type="button"
          onClick={() => navigate("/admin/estudiantes")}
          className="rounded-xl bg-[#279EAA] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#218A95] hover:shadow-md"
        >
          ← Volver a estudiantes
        </button>
      </div>
    </main>
  );
}
