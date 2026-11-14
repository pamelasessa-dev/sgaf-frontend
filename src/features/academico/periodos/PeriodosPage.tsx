/**
 * PeriodosPage.tsx
 *
 * Página principal de gestión de períodos académicos.
 * Permite consultar, registrar, editar y eliminar períodos.
 */

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  obtenerPeriodos,
  eliminarPeriodo,
} from "../../../services/periodoService";

import type { Periodo, EstadoPeriodo } from "../../../types/periodo";

import PeriodoFormulario from "./PeriodoFormulario";
import PeriodoEditarFormulario from "./PeriodoEditarFormulario";

type FiltroEstado = "TODOS" | EstadoPeriodo;

export default function PeriodosPage() {
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>("TODOS");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [periodoSeleccionado, setPeriodoSeleccionado] =
    useState<Periodo | null>(null);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);

  // Consulta los períodos registrados en el backend.
  const cargarPeriodos = useCallback(async () => {
    try {
      setCargando(true);
      setError("");

      const datos = await obtenerPeriodos();
      setPeriodos(datos);
    } catch (error) {
      console.error("Error al cargar períodos:", error);
      setError("No se pudieron cargar los períodos académicos.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargarPeriodos();
  }, [cargarPeriodos]);

  // Filtra por nombre, identificador y estado.
  const periodosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return periodos.filter((periodo) => {
      const coincideBusqueda =
        !termino ||
        periodo.nombre.toLowerCase().includes(termino) ||
        String(periodo.id_periodo).includes(termino);

      const coincideEstado =
        filtroEstado === "TODOS" || periodo.estado === filtroEstado;

      return coincideBusqueda && coincideEstado;
    });
  }, [periodos, busqueda, filtroEstado]);

  // Indicadores calculados con los datos recibidos.
  const estadisticas = useMemo(
    () => ({
      total: periodos.length,
      activos: periodos.filter((p) => p.estado === "ACTIVO").length,
      planificados: periodos.filter((p) => p.estado === "PLANIFICADO").length,
      finalizados: periodos.filter((p) => p.estado === "FINALIZADO").length,
    }),
    [periodos],
  );

  const obtenerColorEstado = (estado: EstadoPeriodo) => {
    switch (estado) {
      case "ACTIVO":
        return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
      case "PLANIFICADO":
        return "bg-blue-50 text-blue-700 ring-blue-600/20";
      case "FINALIZADO":
        return "bg-slate-100 text-slate-600 ring-slate-500/20";
      default:
        return "bg-slate-100 text-slate-600 ring-slate-500/20";
    }
  };

  const formatearFecha = (fecha: string) => {
    const fechaLocal = fecha.slice(0, 10);
    const [anio, mes, dia] = fechaLocal.split("-");
    return `${dia}/${mes}/${anio}`;
  };

  // Elimina un período después de solicitar confirmación.
  const handleEliminar = async (id: number) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar este período académico? Esta acción no se puede deshacer.",
    );

    if (!confirmar) return;

    try {
      setEliminandoId(id);
      setError("");
      setMensaje("");

      await eliminarPeriodo(id);

      setMensaje("El período académico se eliminó correctamente.");
      await cargarPeriodos();
    } catch (error) {
      console.error("Error al eliminar período:", error);

      const respuesta = error as {
        response?: { data?: { message?: string | string[] } };
      };

      const mensajeServidor = respuesta.response?.data?.message;

      setError(
        Array.isArray(mensajeServidor)
          ? mensajeServidor.join(". ")
          : mensajeServidor ||
              "No se pudo eliminar el período académico. Comprueba si tiene grupos asociados.",
      );
    } finally {
      setEliminandoId(null);
    }
  };

  const handlePeriodoCreado = async () => {
    setMostrarFormulario(false);
    setMensaje("El período académico se registró correctamente.");
    await cargarPeriodos();
  };

  const handlePeriodoActualizado = async () => {
    setPeriodoSeleccionado(null);
    setMensaje("El período académico se actualizó correctamente.");
    await cargarPeriodos();
  };

  return (
    <div className="sgaf-animate-in space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Encabezado */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Administración académica
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Períodos académicos
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Administra los ciclos académicos, sus fechas y límites de créditos.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setMensaje("");
            setError("");
            setPeriodoSeleccionado(null);
            setMostrarFormulario((actual) => !actual);
          }}
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          {mostrarFormulario ? "Cerrar formulario" : "+ Nuevo período"}
        </button>
      </div>

      {/* Indicadores */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            titulo: "Total de períodos",
            valor: estadisticas.total,
            detalle: "Registrados en el sistema",
            color: "text-indigo-600",
          },
          {
            titulo: "Activos",
            valor: estadisticas.activos,
            detalle: "En curso actualmente",
            color: "text-emerald-600",
          },
          {
            titulo: "Planificados",
            valor: estadisticas.planificados,
            detalle: "Programados para iniciar",
            color: "text-blue-600",
          },
          {
            titulo: "Finalizados",
            valor: estadisticas.finalizados,
            detalle: "Ciclos académicos cerrados",
            color: "text-slate-600",
          },
        ].map((item) => (
          <article
            key={item.titulo}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">{item.titulo}</p>
            <p className={`mt-2 text-3xl font-bold ${item.color}`}>
              {item.valor}
            </p>
            <p className="mt-1 text-xs text-slate-400">{item.detalle}</p>
          </article>
        ))}
      </section>

      {/* Formularios */}
      {mostrarFormulario && (
        <PeriodoFormulario onPeriodoCreado={handlePeriodoCreado} />
      )}

      {periodoSeleccionado && (
        <PeriodoEditarFormulario
          periodo={periodoSeleccionado}
          onPeriodoActualizado={handlePeriodoActualizado}
          onCancelar={() => setPeriodoSeleccionado(null)}
        />
      )}

      {/* Mensajes */}
      {mensaje && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          {mensaje}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Tabla */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Listado de períodos
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {periodosFiltrados.length} resultado(s)
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              placeholder="Buscar por nombre o ID..."
              className="min-w-0 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:w-64"
            />

            <select
              value={filtroEstado}
              onChange={(event) =>
                setFiltroEstado(event.target.value as FiltroEstado)
              }
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="TODOS">Todos los estados</option>
              <option value="ACTIVO">Activo</option>
              <option value="PLANIFICADO">Planificado</option>
              <option value="FINALIZADO">Finalizado</option>
            </select>
          </div>
        </div>

        {cargando ? (
          <div className="p-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
            <p className="mt-3 text-sm text-slate-500">
              Cargando períodos académicos...
            </p>
          </div>
        ) : periodos.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-medium text-slate-700">
              No hay períodos académicos registrados.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Puedes registrar el primero con el botón «Nuevo período».
            </p>
          </div>
        ) : periodosFiltrados.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            No se encontraron períodos con esos criterios.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">ID</th>
                  <th className="px-5 py-4 font-semibold">Nombre</th>
                  <th className="px-5 py-4 font-semibold">Fecha inicio</th>
                  <th className="px-5 py-4 font-semibold">Fecha fin</th>
                  <th className="px-5 py-4 font-semibold">Límite créditos</th>
                  <th className="px-5 py-4 font-semibold">Estado</th>
                  <th className="px-5 py-4 text-right font-semibold">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {periodosFiltrados.map((periodo) => (
                  <tr
                    key={periodo.id_periodo}
                    className="transition hover:bg-slate-50/80"
                  >
                    <td className="px-5 py-4 font-medium text-slate-500">
                      #{periodo.id_periodo}
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {periodo.nombre}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {formatearFecha(periodo.fecha_inicio)}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {formatearFecha(periodo.fecha_fin)}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {periodo.limite_creditos} créditos
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${obtenerColorEstado(periodo.estado)}`}
                      >
                        {periodo.estado}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setMensaje("");
                            setError("");
                            setMostrarFormulario(false);
                            setPeriodoSeleccionado(periodo);
                          }}
                          className="rounded-lg border border-indigo-200 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          disabled={eliminandoId === periodo.id_periodo}
                          onClick={() =>
                            void handleEliminar(periodo.id_periodo)
                          }
                          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {eliminandoId === periodo.id_periodo
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
    </div>
  );
}
