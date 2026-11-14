/**
 * AulasPage.tsx
 *
 * Página principal de administración de aulas.
 */

import { useCallback, useEffect, useMemo, useState } from "react";

import { obtenerAulas, eliminarAula } from "../../../services/aulaService";
import type { Aula, EstadoAula, TipoAula } from "../../../types/aula";

import AulaFormulario from "./AulaFormulario";
import AulaEditarFormulario from "./AulaEditarFormulario";

type FiltroTipo = "TODOS" | TipoAula;
type FiltroEstado = "TODOS" | EstadoAula;

export default function AulasPage() {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>("TODOS");
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>("TODOS");

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [aulaSeleccionada, setAulaSeleccionada] = useState<Aula | null>(null);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);

  // Consulta las aulas del backend.
  const cargarAulas = useCallback(async () => {
    try {
      setCargando(true);
      setError("");

      const datos = await obtenerAulas();
      setAulas(datos);
    } catch (error) {
      console.error("Error al cargar aulas:", error);
      setError("No se pudieron cargar las aulas. Intenta nuevamente.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargarAulas();
  }, [cargarAulas]);

  // Aplica búsqueda y filtros localmente.
  const aulasFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return aulas.filter((aula) => {
      const coincideBusqueda =
        !termino ||
        aula.nombre.toLowerCase().includes(termino) ||
        (aula.ubicacion ?? "").toLowerCase().includes(termino) ||
        String(aula.id_aula).includes(termino);

      const coincideTipo = filtroTipo === "TODOS" || aula.tipo === filtroTipo;

      const coincideEstado =
        filtroEstado === "TODOS" || aula.estado === filtroEstado;

      return coincideBusqueda && coincideTipo && coincideEstado;
    });
  }, [aulas, busqueda, filtroTipo, filtroEstado]);

  // Indicadores derivados de los datos reales.
  const estadisticas = useMemo(
    () => ({
      total: aulas.length,
      fisicas: aulas.filter((aula) => aula.tipo === "FISICA").length,
      virtuales: aulas.filter((aula) => aula.tipo === "VIRTUAL").length,
      disponibles: aulas.filter((aula) => aula.estado === "DISPONIBLE").length,
    }),
    [aulas],
  );

  // Devuelve un mensaje legible del backend.
  const obtenerMensajeError = (error: unknown): string => {
    const respuesta = error as {
      response?: { data?: { message?: string | string[] } };
    };

    const mensajeServidor = respuesta.response?.data?.message;

    if (Array.isArray(mensajeServidor)) {
      return mensajeServidor.join(". ");
    }

    if (typeof mensajeServidor === "string") {
      return mensajeServidor;
    }

    return "No se pudo completar la operación. Comprueba si el aula está asociada a grupos.";
  };

  const handleEliminar = async (id: number) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar esta aula? Esta acción no se puede deshacer.",
    );

    if (!confirmar) return;

    try {
      setEliminandoId(id);
      setError("");
      setMensaje("");

      await eliminarAula(id);

      setMensaje("El aula se eliminó correctamente.");
      await cargarAulas();
    } catch (error) {
      console.error("Error al eliminar aula:", error);
      setError(obtenerMensajeError(error));
    } finally {
      setEliminandoId(null);
    }
  };

  const handleAulaCreada = async () => {
    setMostrarFormulario(false);
    setMensaje("El aula se registró correctamente.");
    await cargarAulas();
  };

  const handleAulaActualizada = async () => {
    setAulaSeleccionada(null);
    setMensaje("El aula se actualizó correctamente.");
    await cargarAulas();
  };

  const obtenerColorEstado = (estado: EstadoAula) =>
    estado === "DISPONIBLE"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
      : "bg-red-50 text-red-700 ring-red-600/20";

  return (
    <div className="sgaf-animate-in space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Encabezado */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Administración académica
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Gestión de aulas
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Administra los espacios físicos y virtuales de la institución.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setError("");
            setMensaje("");
            setAulaSeleccionada(null);
            setMostrarFormulario((actual) => !actual);
          }}
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          {mostrarFormulario ? "Cerrar formulario" : "+ Nueva aula"}
        </button>
      </div>

      {/* Indicadores */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            titulo: "Total de aulas",
            valor: estadisticas.total,
            detalle: "Registradas en el sistema",
            color: "text-indigo-600",
          },
          {
            titulo: "Aulas físicas",
            valor: estadisticas.fisicas,
            detalle: "Espacios presenciales",
            color: "text-blue-600",
          },
          {
            titulo: "Aulas virtuales",
            valor: estadisticas.virtuales,
            detalle: "Espacios de modalidad virtual",
            color: "text-violet-600",
          },
          {
            titulo: "Disponibles",
            valor: estadisticas.disponibles,
            detalle: "Aulas habilitadas",
            color: "text-emerald-600",
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
      {mostrarFormulario && <AulaFormulario onAulaCreada={handleAulaCreada} />}

      {aulaSeleccionada && (
        <AulaEditarFormulario
          aula={aulaSeleccionada}
          onAulaActualizada={handleAulaActualizada}
          onCancelar={() => setAulaSeleccionada(null)}
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

      {/* Listado */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5">
          <div>
            <h2 className="font-semibold text-slate-900">Listado de aulas</h2>
            <p className="mt-1 text-sm text-slate-500">
              {aulasFiltradas.length} resultado(s)
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <input
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              placeholder="Buscar por nombre, ubicación o ID..."
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:col-span-1"
            />

            <select
              value={filtroTipo}
              onChange={(event) =>
                setFiltroTipo(event.target.value as FiltroTipo)
              }
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="TODOS">Todos los tipos</option>
              <option value="FISICA">Físicas</option>
              <option value="VIRTUAL">Virtuales</option>
            </select>

            <select
              value={filtroEstado}
              onChange={(event) =>
                setFiltroEstado(event.target.value as FiltroEstado)
              }
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="TODOS">Todos los estados</option>
              <option value="DISPONIBLE">Disponible</option>
              <option value="NO_DISPONIBLE">No disponible</option>
            </select>
          </div>
        </div>

        {cargando ? (
          <div className="p-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
            <p className="mt-3 text-sm text-slate-500">Cargando aulas...</p>
          </div>
        ) : error && aulas.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            No se pudo obtener el listado de aulas.
            <button
              type="button"
              onClick={() => void cargarAulas()}
              className="ml-2 font-semibold text-indigo-600 hover:underline"
            >
              Reintentar
            </button>
          </div>
        ) : aulas.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-medium text-slate-700">
              No hay aulas registradas.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Puedes registrar la primera con el botón «Nueva aula».
            </p>
          </div>
        ) : aulasFiltradas.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            No se encontraron aulas con esos criterios.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">ID</th>
                  <th className="px-5 py-4 font-semibold">Nombre</th>
                  <th className="px-5 py-4 font-semibold">Capacidad</th>
                  <th className="px-5 py-4 font-semibold">Ubicación</th>
                  <th className="px-5 py-4 font-semibold">Tipo</th>
                  <th className="px-5 py-4 font-semibold">Estado</th>
                  <th className="px-5 py-4 text-right font-semibold">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {aulasFiltradas.map((aula) => (
                  <tr
                    key={aula.id_aula}
                    className="transition hover:bg-slate-50/80"
                  >
                    <td className="px-5 py-4 font-medium text-slate-500">
                      #{aula.id_aula}
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {aula.nombre}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {aula.capacidad} personas
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {aula.ubicacion || "Sin ubicación"}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium">
                        {aula.tipo === "FISICA" ? "Física" : "Virtual"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${obtenerColorEstado(aula.estado)}`}
                      >
                        {aula.estado === "DISPONIBLE"
                          ? "Disponible"
                          : "No disponible"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setError("");
                            setMensaje("");
                            setMostrarFormulario(false);
                            setAulaSeleccionada(aula);
                          }}
                          className="rounded-lg border border-indigo-200 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50"
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          disabled={eliminandoId === aula.id_aula}
                          onClick={() => void handleEliminar(aula.id_aula)}
                          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {eliminandoId === aula.id_aula
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
