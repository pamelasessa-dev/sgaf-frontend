/**
 * GruposPage.tsx
 *
 * Página principal de administración de grupos académicos.
 *
 * Permite:
 * - Consultar los grupos registrados.
 * - Buscar grupos por nombre, materia o profesor.
 * - Filtrar por estado y período.
 * - Crear nuevos grupos.
 * - Editar grupos existentes.
 * - Eliminar grupos.
 */

import { useEffect, useMemo, useState } from "react";

import type { Grupo, EstadoGrupo } from "../../../types/grupo";

import { obtenerGrupos, eliminarGrupo } from "../../../services/grupoService";

import GrupoFormulario from "./GrupoFormulario";
import GrupoEditarFormulario from "./GrupoEditarFormulario";

export default function GruposPage() {
  // Lista de grupos obtenidos desde el backend.
  const [grupos, setGrupos] = useState<Grupo[]>([]);

  // Estados de la página.
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [filtroPeriodo, setFiltroPeriodo] = useState("TODOS");

  // Control de formularios.
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [grupoEditar, setGrupoEditar] = useState<Grupo | null>(null);

  // Identificador del grupo que se está eliminando.
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);

  // Mensajes de confirmación.
  const [mensaje, setMensaje] = useState("");

  // Consulta los grupos registrados.
  async function cargarGrupos() {
    try {
      setCargando(true);
      setError("");

      const datos = await obtenerGrupos();

      setGrupos(datos);
    } catch (err: unknown) {
      console.error("Error al obtener grupos:", err);

      setError("No fue posible cargar los grupos académicos.");
    } finally {
      setCargando(false);
    }
  }

  // Carga inicial.
  useEffect(() => {
    void cargarGrupos();
  }, []);

  // Obtiene los períodos disponibles para el filtro.
  const periodos = useMemo(() => {
    const mapa = new Map<number, string>();

    grupos.forEach((grupo) => {
      if (grupo.periodo) {
        mapa.set(grupo.periodo.id_periodo, grupo.periodo.nombre);
      }
    });

    return Array.from(mapa.entries()).map(([id, nombre]) => ({
      id,
      nombre,
    }));
  }, [grupos]);

  // Aplica búsqueda y filtros.
  const gruposFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return grupos.filter((grupo) => {
      const nombreProfesor = grupo.profesor?.usuario
        ? [
            grupo.profesor.usuario.primer_nombre,
            grupo.profesor.usuario.segundo_nombre,
            grupo.profesor.usuario.primer_apellido,
            grupo.profesor.usuario.segundo_apellido,
          ]
            .filter(Boolean)
            .join(" ")
        : "";

      const coincideBusqueda =
        !termino ||
        grupo.nombre.toLowerCase().includes(termino) ||
        (grupo.materia?.nombre ?? "").toLowerCase().includes(termino) ||
        nombreProfesor.toLowerCase().includes(termino) ||
        (grupo.aula?.nombre ?? "").toLowerCase().includes(termino);

      const coincideEstado =
        filtroEstado === "TODOS" || grupo.estado === filtroEstado;

      const coincidePeriodo =
        filtroPeriodo === "TODOS" || grupo.id_periodo === Number(filtroPeriodo);

      return coincideBusqueda && coincideEstado && coincidePeriodo;
    });
  }, [grupos, busqueda, filtroEstado, filtroPeriodo]);

  // Calcula los indicadores del módulo.
  const indicadores = useMemo(
    () => ({
      total: grupos.length,
      abiertos: grupos.filter((g) => g.estado === "ABIERTO").length,
      cerrados: grupos.filter((g) => g.estado === "CERRADO").length,
      finalizados: grupos.filter((g) => g.estado === "FINALIZADO").length,
    }),
    [grupos],
  );

  // Cierra los formularios y actualiza el listado.
  async function manejarGrupoCreado() {
    setMostrarFormulario(false);
    setMensaje("El grupo se registró correctamente.");
    await cargarGrupos();
  }

  async function manejarGrupoActualizado() {
    setGrupoEditar(null);
    setMensaje("El grupo se actualizó correctamente.");
    await cargarGrupos();
  }

  // Elimina un grupo después de solicitar confirmación.
  async function manejarEliminar(grupo: Grupo) {
    const confirmar = window.confirm(
      `¿Estás seguro de eliminar el grupo "${grupo.nombre}"?\n\nEsta acción no se puede deshacer.`,
    );

    if (!confirmar) return;

    try {
      setEliminandoId(grupo.id_grupo);
      setError("");
      setMensaje("");

      await eliminarGrupo(grupo.id_grupo);

      setMensaje("El grupo se eliminó correctamente.");

      await cargarGrupos();
    } catch (err: unknown) {
      console.error("Error al eliminar grupo:", err);

      const errorApi = err as {
        response?: {
          data?: {
            message?: string | string[];
          };
        };
      };

      const mensajeApi = errorApi.response?.data?.message;

      setError(
        Array.isArray(mensajeApi)
          ? mensajeApi.join(", ")
          : mensajeApi ||
              "No fue posible eliminar el grupo. Puede tener matrículas, actividades u horarios asociados.",
      );
    } finally {
      setEliminandoId(null);
    }
  }

  // Devuelve el nombre completo del profesor.
  function obtenerNombreProfesor(grupo: Grupo): string {
    const usuario = grupo.profesor?.usuario;

    if (!usuario) {
      return `Profesor #${grupo.id_profesor}`;
    }

    return [
      usuario.primer_nombre,
      usuario.segundo_nombre,
      usuario.primer_apellido,
      usuario.segundo_apellido,
    ]
      .filter(Boolean)
      .join(" ");
  }

  // Devuelve los estilos visuales según el estado.
  function claseEstado(estado: EstadoGrupo): string {
    const clases: Record<EstadoGrupo, string> = {
      ABIERTO: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
      CERRADO: "bg-amber-50 text-amber-700 ring-amber-600/20",
      FINALIZADO: "bg-slate-100 text-slate-600 ring-slate-500/20",
    };

    return clases[estado];
  }

  // Traduce el estado para mostrarlo en pantalla.
  function nombreEstado(estado: EstadoGrupo): string {
    const nombres: Record<EstadoGrupo, string> = {
      ABIERTO: "Abierto",
      CERRADO: "Cerrado",
      FINALIZADO: "Finalizado",
    };

    return nombres[estado];
  }

  // Si se está creando o editando, mostramos el formulario correspondiente.
  if (mostrarFormulario) {
    return (
      <div className="space-y-6">
        <div>
          <button
            type="button"
            onClick={() => setMostrarFormulario(false)}
            className="mb-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            ← Volver a grupos
          </button>

          <h1 className="text-2xl font-bold text-slate-900">
            Registrar grupo académico
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Completa los datos para crear un nuevo grupo.
          </p>
        </div>

        <GrupoFormulario onGrupoCreado={manejarGrupoCreado} />
      </div>
    );
  }

  if (grupoEditar) {
    return (
      <div className="space-y-6">
        <div>
          <button
            type="button"
            onClick={() => setGrupoEditar(null)}
            className="mb-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            ← Volver a grupos
          </button>

          <h1 className="text-2xl font-bold text-slate-900">
            Editar grupo académico
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Modifica los datos permitidos del grupo seleccionado.
          </p>
        </div>

        <GrupoEditarFormulario
          grupo={grupoEditar}
          onGrupoActualizado={manejarGrupoActualizado}
          onCancelar={() => setGrupoEditar(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 sgaf-animate-in">
      {/* Encabezado */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-indigo-600">
            Administración académica
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Grupos académicos
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Gestiona los grupos, sus materias, profesores y aulas asignadas.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setMensaje("");
            setMostrarFormulario(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <span className="text-lg">+</span>
          Registrar grupo
        </button>
      </div>

      {/* Mensaje de éxito */}
      {mensaje && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <span>{mensaje}</span>

          <button
            type="button"
            onClick={() => setMensaje("")}
            className="font-bold"
            aria-label="Cerrar mensaje"
          >
            ×
          </button>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            className="font-bold"
            aria-label="Cerrar error"
          >
            ×
          </button>
        </div>
      )}

      {/* Indicadores */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total de grupos</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {indicadores.total}
          </p>
          <p className="mt-1 text-xs text-slate-400">Grupos registrados</p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Abiertos</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {indicadores.abiertos}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Disponibles para gestión académica
          </p>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Cerrados</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">
            {indicadores.cerrados}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Grupos sin nuevas inscripciones
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Finalizados</p>
          <p className="mt-2 text-3xl font-bold text-slate-600">
            {indicadores.finalizados}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Grupos de períodos anteriores
          </p>
        </div>
      </div>

      {/* Tabla y filtros */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="font-semibold text-slate-900">
                Listado de grupos
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Consulta y administra los grupos académicos registrados.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void cargarGrupos()}
              disabled={cargando}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              ↻ Actualizar
            </button>
          </div>

          {/* Búsqueda y filtros */}
          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="md:col-span-1">
              <label
                htmlFor="buscar-grupo"
                className="mb-1.5 block text-xs font-semibold text-slate-600"
              >
                Buscar grupo
              </label>

              <input
                id="buscar-grupo"
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Nombre, materia, profesor o aula..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="filtro-estado-grupo"
                className="mb-1.5 block text-xs font-semibold text-slate-600"
              >
                Estado
              </label>

              <select
                id="filtro-estado-grupo"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="TODOS">Todos los estados</option>
                <option value="ABIERTO">Abierto</option>
                <option value="CERRADO">Cerrado</option>
                <option value="FINALIZADO">Finalizado</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="filtro-periodo-grupo"
                className="mb-1.5 block text-xs font-semibold text-slate-600"
              >
                Período académico
              </label>

              <select
                id="filtro-periodo-grupo"
                value={filtroPeriodo}
                onChange={(e) => setFiltroPeriodo(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="TODOS">Todos los períodos</option>

                {periodos.map((periodo) => (
                  <option key={periodo.id} value={periodo.id}>
                    {periodo.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Contenido de la tabla */}
        {cargando ? (
          <div className="flex flex-col items-center justify-center px-6 py-16">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />

            <p className="mt-4 text-sm text-slate-500">
              Cargando grupos académicos...
            </p>
          </div>
        ) : gruposFiltrados.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
              📚
            </div>

            <h3 className="mt-4 font-semibold text-slate-800">
              No se encontraron grupos
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {grupos.length === 0
                ? "Todavía no hay grupos registrados en el sistema."
                : "Prueba modificando los términos de búsqueda o los filtros."}
            </p>

            {grupos.length === 0 && (
              <button
                type="button"
                onClick={() => setMostrarFormulario(true)}
                className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Registrar primer grupo
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-[1050px] divide-y divide-slate-200 text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Grupo
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Materia
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Profesor
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Período
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Aula
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Cupo
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Estado
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {gruposFiltrados.map((grupo) => (
                    <tr
                      key={grupo.id_grupo}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800">
                          {grupo.nombre}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          ID: {grupo.id_grupo}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-700">
                          {grupo.materia?.nombre ??
                            `Materia #${grupo.id_materia}`}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {grupo.materia?.creditos ?? "—"} créditos
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-700">
                          {obtenerNombreProfesor(grupo)}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {grupo.profesor?.especialidad ?? "Profesor"}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {grupo.periodo?.nombre ??
                          `Período #${grupo.id_periodo}`}
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-700">
                          {grupo.aula?.nombre ?? `Aula #${grupo.id_aula}`}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {grupo.aula?.tipo === "VIRTUAL"
                            ? "Virtual"
                            : grupo.aula?.tipo === "FISICA"
                              ? "Física"
                              : "Sin información"}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                        {grupo.cupo_maximo} estudiantes
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${claseEstado(grupo.estado)}`}
                        >
                          {nombreEstado(grupo.estado)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setMensaje("");
                              setGrupoEditar(grupo);
                            }}
                            className="rounded-lg border border-indigo-200 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50"
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() => void manejarEliminar(grupo)}
                            disabled={eliminandoId === grupo.id_grupo}
                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                          >
                            {eliminandoId === grupo.id_grupo
                              ? "Eliminando..."
                              : "Eliminar"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-5 py-3">
              <p className="text-xs text-slate-500">
                Mostrando{" "}
                <span className="font-semibold text-slate-700">
                  {gruposFiltrados.length}
                </span>{" "}
                de{" "}
                <span className="font-semibold text-slate-700">
                  {grupos.length}
                </span>{" "}
                grupos registrados.
              </p>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
