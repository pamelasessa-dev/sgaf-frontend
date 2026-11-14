/**
 * AdminDashboard.tsx
 *
 * Panel principal del administrador del SGAF.
 * Presenta accesos visuales a los módulos administrativos.
 *
 * Las estadísticas reales se incorporarán cuando conectemos
 * los endpoints correspondientes.
 */

import { useNavigate } from "react-router-dom";

const modulos = [
  {
    titulo: "Usuarios",
    descripcion: "Consultar, aprobar y administrar los usuarios del sistema.",
    ruta: "/usuarios",
    icono: "👥",
    categoria: "Administración",
    color: "bg-[#DFF3FA] text-[#23849A]",
    detalle: "Gestión de accesos y usuarios",
    hover: "hover:border-[#BDE8F1] hover:shadow-[#BDE8F1]/50",
  },
  {
    titulo: "Estudiantes",
    descripcion: "Consultar estudiantes y acceder a su información académica.",
    ruta: "/admin/estudiantes",
    icono: "🎓",
    categoria: "Académico",
    color: "bg-[#EDE7FA] text-[#765BAA]",
    detalle: "Información de estudiantes",
    hover: "hover:border-[#D8CCF0] hover:shadow-[#EDE7FA]/60",
  },
  {
    titulo: "Profesores",
    descripcion: "Registrar, consultar, editar y administrar profesores.",
    ruta: "/admin/profesores",
    icono: "👨‍🏫",
    categoria: "Académico",
    color: "bg-[#DDF3E5] text-[#328456]",
    detalle: "Personal docente",
    hover: "hover:border-[#A9DDBD] hover:shadow-[#DDF3E5]/70",
  },
  {
    titulo: "Materias",
    descripcion: "Administrar las materias, sus créditos y costos académicos.",
    ruta: "/admin/materias",
    icono: "📚",
    categoria: "Académico",
    color: "bg-[#FFF6C9] text-[#A18422]",
    detalle: "Catálogo de materias",
    hover: "hover:border-[#F2E39A] hover:shadow-[#FFF6C9]/70",
  },
  {
    titulo: "Períodos académicos",
    descripcion:
      "Configurar los períodos y sus fechas de inicio y finalización.",
    ruta: "/admin/periodos",
    icono: "📅",
    categoria: "Planificación",
    color: "bg-[#FFF0D9] text-[#C17A28]",
    detalle: "Calendario académico",
    hover: "hover:border-[#F5D7A8] hover:shadow-[#FFF0D9]/70",
  },
  {
    titulo: "Aulas",
    descripcion:
      "Administrar aulas físicas y virtuales, capacidad y disponibilidad.",
    ruta: "/admin/aulas",
    icono: "🏫",
    categoria: "Infraestructura",
    color: "bg-[#DDF3E5] text-[#328456]",
    detalle: "Espacios académicos",
    hover: "hover:border-[#A9DDBD] hover:shadow-[#DDF3E5]/70",
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Encabezado de bienvenida */}
      <section className="relative overflow-hidden rounded-2xl border border-[#BDE8F1] bg-gradient-to-r from-[#DFF3FA] via-[#E9F7FA] to-[#DDF3E5] p-6 shadow-sm sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#A9DDBD] bg-white/80 px-3 py-1 text-xs font-semibold text-[#328456]">
            <span className="h-2 w-2 rounded-full bg-[#48A875]" />
            Panel de administración
          </span>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-[#192F4B] sm:text-3xl">
            Bienvenido al SGAF
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            Gestiona los procesos académicos y administrativos desde un solo
            lugar. Selecciona el módulo que deseas administrar.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/usuarios")}
              className="rounded-xl bg-[#279EAA] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#218A95] hover:shadow-md"
            >
              Administrar usuarios
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/estudiantes")}
              className="rounded-xl border border-[#A9DDBD] bg-white/80 px-5 py-2.5 text-sm font-semibold text-[#285C3D] transition hover:bg-white"
            >
              Ver estudiantes
            </button>
          </div>
        </div>

        {/* Decoración visual */}
        <div
          aria-hidden="true"
          className="absolute -right-12 -top-20 h-72 w-72 rounded-full border-[35px] border-white/40"
        />

        <div
          aria-hidden="true"
          className="absolute -bottom-32 right-28 h-64 w-64 rounded-full bg-[#A9DDBD]/40 blur-2xl"
        />

        <div
          aria-hidden="true"
          className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#FFF0D9]/50 blur-3xl"
        />
      </section>

      {/* Encabezado de módulos */}
      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#192F4B]">
              Gestión del sistema
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Accede a los módulos disponibles para tu perfil.
            </p>
          </div>

          <span className="rounded-full border border-[#BDE8F1] bg-[#DFF3FA] px-3 py-1 text-xs font-semibold text-[#236B79]">
            {modulos.length} módulos disponibles
          </span>
        </div>

        {/* Tarjetas de módulos */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {modulos.map((modulo) => (
            <button
              key={modulo.ruta}
              type="button"
              onClick={() => navigate(modulo.ruta)}
              className={`group flex min-h-56 flex-col rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#279EAA] ${modulo.hover}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition-transform group-hover:scale-110 ${modulo.color}`}
                >
                  <span aria-hidden="true">{modulo.icono}</span>
                </div>

                <span className="rounded-full bg-[#F4F7FA] px-3 py-1 text-xs font-medium text-slate-500">
                  {modulo.categoria}
                </span>
              </div>

              <h3 className="mt-5 text-base font-bold text-[#192F4B] transition-colors group-hover:text-[#279EAA]">
                {modulo.titulo}
              </h3>

              <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
                {modulo.descripcion}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs font-medium text-slate-400">
                  {modulo.detalle}
                </span>

                <span
                  aria-hidden="true"
                  className="text-lg text-[#279EAA] transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Información complementaria */}
      <section className="rounded-2xl border border-[#F5D7A8] bg-gradient-to-r from-[#FFF6C9] via-[#FFF9E8] to-[#FFF0D9] p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
            ℹ️
          </div>

          <div>
            <h2 className="font-semibold text-[#80691F]">
              Centro de administración
            </h2>

            <p className="mt-1 text-sm leading-6 text-[#80691F]/90">
              Desde este panel puedes gestionar los usuarios, la estructura
              académica y los espacios disponibles. Los indicadores y
              notificaciones se incorporarán al conectar los servicios
              correspondientes del sistema.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}