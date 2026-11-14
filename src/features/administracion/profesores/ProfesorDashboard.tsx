import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useAuthStore } from "../../../stores/authStore";
import { obtenerGrupos } from "../../../services/grupoService";
import { obtenerActividadesPorGrupo } from "../../../services/actividadService";

import type { Grupo } from "../../../types/grupo";
import type { ActividadAcademica } from "../../../types/aulaVirtual";

export default function ProfesorDashboard() {
  
  const usuario = useAuthStore((state) => state.usuario);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [actividades, setActividades] = useState<ActividadAcademica[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    const cargarDashboard = async () => {
      try {
        setCargando(true);
        setError("");

        const respuestaGrupos = await obtenerGrupos();

        const misGrupos = respuestaGrupos.filter(
          (grupo) =>
            grupo.profesor?.usuario?.id_usuario === usuario?.id_usuario,
        );

        if (!activo) return;

        setGrupos(misGrupos);

        const resultados = await Promise.all(
          misGrupos.map((grupo) => obtenerActividadesPorGrupo(grupo.id_grupo)),
        );

        if (!activo) return;

        setActividades(resultados.flat());
      } catch {
        if (activo) {
          setError(
            "No fue posible cargar toda la información académica. Intenta nuevamente.",
          );
        }
      } finally {
        if (activo) setCargando(false);
      }
    };

    if (usuario?.id_usuario) {
      void cargarDashboard();
    } else {
      setCargando(false);
    }

    return () => {
      activo = false;
    };
  }, [usuario?.id_usuario]);

  const nombreProfesor = usuario?.email?.split("@")[0] || "Profesor";

  const actividadesAbiertas = useMemo(
    () => actividades.filter((actividad) => actividad.estado === "ABIERTA"),
    [actividades],
  );

  const actividadesBorrador = useMemo(
    () => actividades.filter((actividad) => actividad.estado === "BORRADOR"),
    [actividades],
  );

  const proximasActividades = useMemo(() => {
    const ahora = new Date();

    return actividades
      .filter(
        (actividad) =>
          actividad.estado === "ABIERTA" &&
          new Date(actividad.fecha_cierre) >= ahora,
      )
      .sort(
        (a, b) =>
          new Date(a.fecha_cierre).getTime() -
          new Date(b.fecha_cierre).getTime(),
      )
      .slice(0, 4);
  }, [actividades]);

  const formatearFecha = (fecha: string) => {
    const valor = new Date(fecha);

    if (Number.isNaN(valor.getTime())) return "Fecha no disponible";

    return valor.toLocaleDateString("es-UY", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (cargando) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-[#DFF3FA] border-t-[#279EAA]" />
          <p className="text-sm text-slate-500">
            Preparando tu espacio docente...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="space-y-8">
      {/* Bienvenida */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#DFF3FA] via-[#E9F7F5] to-[#DDF3E5] p-6 shadow-sm sm:p-9">
        <div className="absolute -right-10 -top-12 h-48 w-48 rounded-full bg-white/40" />
        <div className="absolute -bottom-16 right-36 h-40 w-40 rounded-full bg-[#FFF0D9]/70" />

        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-xs font-semibold text-[#279EAA]">
            <span>🎓</span> ESPACIO DOCENTE
          </span>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-[#192F4B] sm:text-4xl">
            ¡Bienvenido, {nombreProfesor}!
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            Este es tu espacio de trabajo académico. Desde aquí puedes organizar
            tus grupos, gestionar actividades y acompañar el aprendizaje de tus
            estudiantes.
          </p>

          <Link
            to="/profesor/aula-virtual"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#279EAA] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#208894]"
          >
            <span>📚</span>
            Ir al Aula Virtual
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Indicadores */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-[#192F4B]">
            Resumen académico
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Estado actual de tu actividad docente.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-[#BDE8F1] bg-[#DFF3FA] p-5 transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#236B91]">
                Mis grupos
              </span>
              <span className="text-2xl">📚</span>
            </div>
            <p className="mt-4 text-4xl font-bold text-[#236B91]">
              {grupos.length}
            </p>
            <p className="mt-2 text-xs text-[#236B91]/80">
              Grupos académicos asignados
            </p>
          </article>

          <article className="rounded-2xl border border-[#A9DDBD] bg-[#DDF3E5] p-5 transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#328456]">
                Actividades
              </span>
              <span className="text-2xl">📝</span>
            </div>
            <p className="mt-4 text-4xl font-bold text-[#328456]">
              {actividades.length}
            </p>
            <p className="mt-2 text-xs text-[#328456]/80">
              Actividades registradas en tus grupos
            </p>
          </article>

          <article className="rounded-2xl border border-[#F5D8A8] bg-[#FFF0D9] p-5 transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#A76520]">
                Actividades abiertas
              </span>
              <span className="text-2xl">📖</span>
            </div>
            <p className="mt-4 text-4xl font-bold text-[#A76520]">
              {actividadesAbiertas.length}
            </p>
            <p className="mt-2 text-xs text-[#A76520]/80">
              Disponibles para tus estudiantes
            </p>
          </article>

          <article className="rounded-2xl border border-[#D9CCF2] bg-[#EDE7FA] p-5 transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#7655A5]">
                Borradores
              </span>
              <span className="text-2xl">📋</span>
            </div>
            <p className="mt-4 text-4xl font-bold text-[#7655A5]">
              {actividadesBorrador.length}
            </p>
            <p className="mt-2 text-xs text-[#7655A5]/80">
              Actividades pendientes de publicar
            </p>
          </article>
        </div>
      </section>

      {/* Accesos rápidos */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-[#192F4B]">Accesos rápidos</h2>
          <p className="mt-1 text-sm text-slate-500">
            Tus herramientas principales de trabajo.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Link
            to="/profesor/aula-virtual"
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#279EAA] hover:shadow-md"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#DFF3FA] text-3xl">
              📚
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-[#192F4B]">Aula Virtual</h3>
              <p className="mt-1 text-sm text-slate-500">
                Gestiona grupos, actividades y entregas.
              </p>
            </div>
            <span className="text-xl text-[#279EAA] transition group-hover:translate-x-1">
              →
            </span>
          </Link>

          <Link
            to="/profesor/perfil"
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#279EAA] hover:shadow-md"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EDE7FA] text-3xl">
              👤
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-[#192F4B]">Mi perfil</h3>
              <p className="mt-1 text-sm text-slate-500">
                Consulta tus datos personales y de usuario.
              </p>
            </div>
            <span className="text-xl text-[#279EAA] transition group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </section>

      {/* Próximas actividades */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#192F4B]">
              Próximas actividades
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Actividades abiertas ordenadas por fecha de cierre.
            </p>
          </div>

          <Link
            to="/profesor/aula-virtual"
            className="text-sm font-semibold text-[#279EAA] hover:underline"
          >
            Ver Aula Virtual →
          </Link>
        </div>

        {proximasActividades.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {proximasActividades.map((actividad) => (
              <div
                key={actividad.id_actividad}
                className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DFF3FA] text-xl">
                    📝
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-[#192F4B]">
                      {actividad.titulo}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {actividad.grupo?.nombre ||
                        grupos.find(
                          (grupo) => grupo.id_grupo === actividad.id_grupo,
                        )?.nombre ||
                        "Grupo académico"}
                      {" · "}
                      {actividad.tipo}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="rounded-full bg-[#FFF0D9] px-3 py-1 text-xs font-semibold text-[#A76520]">
                    Cierra el {formatearFecha(actividad.fecha_cierre)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-[#F4F7FA] px-4 py-10 text-center">
            <div className="text-4xl">🌱</div>
            <p className="mt-3 font-semibold text-[#192F4B]">
              No hay actividades próximas
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Cuando publiques actividades, aparecerán aquí.
            </p>
          </div>
        )}
      </section>

      {/* Grupos */}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#192F4B]">
              Mis grupos académicos
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Acceso a los grupos que tienes asignados.
            </p>
          </div>

          <Link
            to="/profesor/aula-virtual"
            className="text-sm font-semibold text-[#279EAA] hover:underline"
          >
            Administrar grupos →
          </Link>
        </div>

        {grupos.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {grupos.map((grupo, indice) => {
              const fondos = [
                "bg-[#DFF3FA] border-[#BDE8F1]",
                "bg-[#DDF3E5] border-[#A9DDBD]",
                "bg-[#EDE7FA] border-[#D9CCF2]",
                "bg-[#FFF0D9] border-[#F5D8A8]",
              ];

              return (
                <article
                  key={grupo.id_grupo}
                  className={`rounded-2xl border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${fondos[indice % fondos.length]}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Grupo académico
                      </p>
                      <h3 className="mt-2 text-lg font-bold text-[#192F4B]">
                        {grupo.nombre}
                      </h3>
                    </div>
                    <span className="text-2xl">🎓</span>
                  </div>

                  <p className="mt-3 text-sm text-slate-600">
                    {grupo.materia?.nombre || "Materia académica"}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600">
                      {grupo.estado}
                    </span>
                    <Link
                      to="/profesor/aula-virtual"
                      className="text-sm font-bold text-[#279EAA] hover:underline"
                    >
                      Ver grupo →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <div className="text-4xl">📚</div>
            <h3 className="mt-3 font-semibold text-[#192F4B]">
              No tienes grupos asignados
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Cuando administración te asigne grupos, aparecerán en este panel.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
