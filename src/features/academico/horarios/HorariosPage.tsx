/**
 * HorariosPage.tsx
 *
 * Página principal para administrar los horarios académicos del SGAF.
 *
 * Permite:
 * - Consultar los horarios registrados.
 * - Buscar por grupo, materia, profesor o aula.
 * - Filtrar por día de la semana.
 * - Registrar nuevos horarios.
 * - Editar horarios existentes.
 * - Eliminar horarios.
 */

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  eliminarHorario,
  obtenerHorarios,
} from "../../../services/horarioService";

import type { Horario, DiaSemana } from "../../../types/horario";

import HorarioFormulario from "./HorarioFormulario";
import HorarioEditarFormulario from "./HorarioEditarFormulario";

// Días disponibles para filtrar los horarios.
const DIAS_SEMANA: { valor: DiaSemana | "TODOS"; etiqueta: string }[] = [
  { valor: "TODOS", etiqueta: "Todos los días" },
  { valor: "LUNES", etiqueta: "Lunes" },
  { valor: "MARTES", etiqueta: "Martes" },
  { valor: "MIERCOLES", etiqueta: "Miércoles" },
  { valor: "JUEVES", etiqueta: "Jueves" },
  { valor: "VIERNES", etiqueta: "Viernes" },
  { valor: "SABADO", etiqueta: "Sábado" },
  { valor: "DOMINGO", etiqueta: "Domingo" },
];

// Convierte las horas ISO del backend al formato HH:mm.
// Se utiliza la hora recibida, sin aplicar conversiones de zona horaria.
function formatearHora(valor: string): string {
  const coincidencia = valor.match(/T(\d{2}:\d{2})/);

  if (coincidencia) {
    return coincidencia[1];
  }

  return valor;
}

// Obtiene el nombre completo del profesor.
function obtenerNombreProfesor(horario: Horario): string {
  const usuario = horario.grupo?.profesor?.usuario;

  if (!usuario) {
    return horario.grupo
      ? `Profesor #${horario.grupo.id_profesor}`
      : "No disponible";
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

// Traduce los días para mostrarlos en pantalla.
function obtenerEtiquetaDia(dia: DiaSemana): string {
  return DIAS_SEMANA.find((item) => item.valor === dia)?.etiqueta ?? dia;
}

export default function HorariosPage() {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [filtroDia, setFiltroDia] = useState<DiaSemana | "TODOS">("TODOS");

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [horarioSeleccionado, setHorarioSeleccionado] =
    useState<Horario | null>(null);

  const [procesandoId, setProcesandoId] = useState<number | null>(null);

  // Consulta los horarios registrados en el backend.
  const cargarHorarios = useCallback(async () => {
    try {
      setCargando(true);
      setError("");

      const datos = await obtenerHorarios();

      setHorarios(datos);
    } catch (error: unknown) {
      console.error("Error al cargar horarios:", error);

      setError("No fue posible cargar los horarios académicos.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargarHorarios();
  }, [cargarHorarios]);

  // Filtra los horarios según la búsqueda y el día seleccionado.
  const horariosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return horarios.filter((horario) => {
      const grupo = horario.grupo;

      const coincideDia =
        filtroDia === "TODOS" || horario.dia_semana === filtroDia;

      const textoBusqueda = [
        grupo?.nombre,
        grupo?.materia?.nombre,
        obtenerNombreProfesor(horario),
        grupo?.aula?.nombre,
        grupo?.periodo?.nombre,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const coincideBusqueda =
        termino === "" || textoBusqueda.includes(termino);

      return coincideDia && coincideBusqueda;
    });
  }, [horarios, busqueda, filtroDia]);

  // Calcula indicadores para el encabezado del módulo.
  const diasProgramados = useMemo(
    () => new Set(horarios.map((horario) => horario.dia_semana)).size,
    [horarios],
  );

  const gruposProgramados = useMemo(
    () => new Set(horarios.map((horario) => horario.id_grupo)).size,
    [horarios],
  );

  // Actualiza la lista después de registrar un horario.
  async function manejarHorarioCreado() {
    await cargarHorarios();
    setMostrarFormulario(false);
    setMensaje("El horario se registró correctamente.");
    setHorarioSeleccionado(null);
  }

  // Actualiza la lista después de editar un horario.
  async function manejarHorarioActualizado() {
    await cargarHorarios();
    setHorarioSeleccionado(null);
    setMensaje("El horario se actualizó correctamente.");
  }

  // Elimina un horario seleccionado.
  async function manejarEliminar(horario: Horario) {
    const confirmar = window.confirm(
      `¿Estás seguro de eliminar el horario del grupo ${
        horario.grupo?.nombre ?? `#${horario.id_grupo}`
      }?`,
    );

    if (!confirmar) {
      return;
    }

    try {
      setProcesandoId(horario.id_horario);
      setError("");
      setMensaje("");

      await eliminarHorario(horario.id_horario);

      await cargarHorarios();

      setMensaje("El horario se eliminó correctamente.");
    } catch (error: unknown) {
      console.error("Error al eliminar horario:", error);

      const errorApi = error as {
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
          : mensajeApi || "No fue posible eliminar el horario.",
      );
    } finally {
      setProcesandoId(null);
    }
  }

  // Abre el formulario de edición.
  function manejarEditar(horario: Horario) {
    setMostrarFormulario(false);
    setMensaje("");
    setHorarioSeleccionado(horario);
  }

  // Abre el formulario de registro.
  function manejarNuevoHorario() {
    setHorarioSeleccionado(null);
    setMensaje("");
    setMostrarFormulario(true);
  }

  // Cierra los formularios.
  function manejarCancelarFormulario() {
    setMostrarFormulario(false);
    setHorarioSeleccionado(null);
  }

  return (
    <div className="space-y-7 sgaf-animate-in">
      {/* Encabezado */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-indigo-600">
            Gestión académica
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Horarios académicos
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Organiza los días y horarios de las clases de cada grupo.
          </p>
        </div>

        {!mostrarFormulario && !horarioSeleccionado && (
          <button
            type="button"
            onClick={manejarNuevoHorario}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <span className="text-lg">+</span>
            Nuevo horario
          </button>
        )}
      </div>

      {/* Indicadores */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Horarios registrados
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {horarios.length}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Total de clases programadas
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Días programados</p>

          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {diasProgramados}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Días con actividades académicas
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Grupos programados
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {gruposProgramados}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Grupos con al menos un horario
          </p>
        </div>
      </div>

      {/* Mensajes generales */}
      {mensaje && (
        <div
          role="status"
          className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          <span>{mensaje}</span>

          <button
            type="button"
            onClick={() => setMensaje("")}
            className="font-semibold"
            aria-label="Cerrar mensaje"
          >
            ×
          </button>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            className="font-semibold"
            aria-label="Cerrar error"
          >
            ×
          </button>
        </div>
      )}

      {/* Formulario de registro */}
      {mostrarFormulario && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Registrar horario
            </h2>

            <button
              type="button"
              onClick={manejarCancelarFormulario}
              className="text-sm font-semibold text-slate-500 hover:text-slate-800"
            >
              Cancelar
            </button>
          </div>

          <HorarioFormulario onHorarioCreado={manejarHorarioCreado} />
        </section>
      )}

      {/* Formulario de edición */}
      {horarioSeleccionado && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Editar horario</h2>

          <HorarioEditarFormulario
            horario={horarioSeleccionado}
            onHorarioActualizado={manejarHorarioActualizado}
            onCancelar={manejarCancelarFormulario}
          />
        </section>
      )}

      {/* Búsqueda y filtros */}
      {!mostrarFormulario && !horarioSeleccionado && (
        <>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                <label
                  htmlFor="buscar-horario"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Buscar horario
                </label>

                <input
                  id="buscar-horario"
                  type="search"
                  value={busqueda}
                  onChange={(evento) => setBusqueda(evento.target.value)}
                  placeholder="Buscar por grupo, materia, profesor o aula..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label
                  htmlFor="filtro-dia"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Filtrar por día
                </label>

                <select
                  id="filtro-dia"
                  value={filtroDia}
                  onChange={(evento) =>
                    setFiltroDia(evento.target.value as DiaSemana | "TODOS")
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                >
                  {DIAS_SEMANA.map((dia) => (
                    <option key={dia.valor} value={dia.valor}>
                      {dia.etiqueta}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
              <p className="text-sm text-slate-500">
                Mostrando{" "}
                <strong className="text-slate-800">
                  {horariosFiltrados.length}
                </strong>{" "}
                de {horarios.length} horarios
              </p>

              {(busqueda || filtroDia !== "TODOS") && (
                <button
                  type="button"
                  onClick={() => {
                    setBusqueda("");
                    setFiltroDia("TODOS");
                  }}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </section>

          {/* Tabla de horarios */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="font-bold text-slate-900">Listado de horarios</h2>

              <p className="mt-1 text-xs text-slate-500">
                Información de los grupos y sus horarios asignados.
              </p>
            </div>

            {cargando ? (
              <div className="px-5 py-16 text-center">
                <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />

                <p className="mt-4 text-sm text-slate-500">
                  Cargando horarios académicos...
                </p>
              </div>
            ) : error && horarios.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <p className="font-semibold text-slate-800">
                  No se pudo cargar la información.
                </p>

                <button
                  type="button"
                  onClick={() => void cargarHorarios()}
                  className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Reintentar
                </button>
              </div>
            ) : horariosFiltrados.length === 0 ? (
              <div className="px-5 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
                  <span>▦</span>
                </div>

                <h3 className="mt-4 font-semibold text-slate-900">
                  No hay horarios para mostrar
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {horarios.length === 0
                    ? "Todavía no se han registrado horarios académicos."
                    : "No encontramos horarios que coincidan con los filtros."}
                </p>

                {horarios.length === 0 && (
                  <button
                    type="button"
                    onClick={manejarNuevoHorario}
                    className="mt-4 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    Registrar primer horario
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-[1050px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Grupo</th>
                      <th className="px-5 py-4 font-semibold">Materia</th>
                      <th className="px-5 py-4 font-semibold">Profesor</th>
                      <th className="px-5 py-4 font-semibold">Aula</th>
                      <th className="px-5 py-4 font-semibold">Día</th>
                      <th className="px-5 py-4 font-semibold">Horario</th>
                      <th className="px-5 py-4 text-right font-semibold">
                        Acciones
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {horariosFiltrados.map((horario) => (
                      <tr
                        key={horario.id_horario}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <span className="font-semibold text-slate-900">
                            {horario.grupo?.nombre ??
                              `Grupo #${horario.id_grupo}`}
                          </span>

                          <p className="mt-1 text-xs text-slate-400">
                            ID: {horario.id_grupo}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span className="font-medium text-slate-700">
                            {horario.grupo?.materia?.nombre ?? "No disponible"}
                          </span>

                          <p className="mt-1 text-xs text-slate-400">
                            {horario.grupo?.periodo?.nombre ?? ""}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {obtenerNombreProfesor(horario)}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {horario.grupo?.aula?.nombre ?? "No asignada"}
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                            {obtenerEtiquetaDia(horario.dia_semana)}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="font-semibold tabular-nums text-slate-800">
                            {formatearHora(horario.hora_inicio)}
                          </div>

                          <div className="mt-1 text-xs tabular-nums text-slate-500">
                            hasta {formatearHora(horario.hora_fin)}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => manejarEditar(horario)}
                              disabled={procesandoId === horario.id_horario}
                              className="rounded-lg border border-indigo-200 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50 disabled:opacity-50"
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              onClick={() => void manejarEliminar(horario)}
                              disabled={procesandoId === horario.id_horario}
                              className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                            >
                              {procesandoId === horario.id_horario
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
            )}
          </section>
        </>
      )}
    </div>
  );
}
/**Qué incluye esta página
- Indicadores de horarios, días y grupos programados.
- Búsqueda por grupo, materia, profesor, aula y período.
- Filtro por día de la semana.
- Formulario integrado para registrar horarios.
- Formulario integrado para editar horarios.
- Eliminación con confirmación.
- Estados de carga, error y lista vacía.
- Diseño adaptable a dispositivos móviles. */
