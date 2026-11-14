/**
 * MateriasPage.tsx
 *
 * Página principal para administrar las materias.
 *
 * Permite consultar, buscar, filtrar, registrar, editar
 * y eliminar materias utilizando los servicios existentes.
 */

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  obtenerMaterias,
  eliminarMateria,
} from "../../../services/materiaService";

import type { Materia } from "../../../types/materia";

import MateriaFormulario from "./MateriaFormulario";
import MateriaEditarFormulario from "./MateriaEditarFormulario";

type FiltroEstado = "TODAS" | "ACTIVA" | "INACTIVA";

// Formatea los importes recibidos desde el backend.
function formatearMoneda(valor: string | number): string {
  const numero = Number(valor);

  if (!Number.isFinite(numero)) {
    return String(valor);
  }

  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(numero);
}

export default function MateriasPage() {
  // Lista de materias obtenidas desde el backend.
  const [materias, setMaterias] = useState<Materia[]>([]);

  // Controla la carga de información.
  const [cargando, setCargando] = useState(true);

  // Guarda posibles errores.
  const [error, setError] = useState("");

  // Materia que se está editando.
  const [materiaSeleccionada, setMateriaSeleccionada] =
    useState<Materia | null>(null);

  // Controla la visibilidad del formulario de registro.
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Controla qué materia se está eliminando.
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);

  // Búsqueda y filtros de la tabla.
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>("TODAS");

  // Consulta las materias al backend.
  const cargarMaterias = useCallback(async () => {
    try {
      setCargando(true);
      setError("");

      const datos = await obtenerMaterias();
      setMaterias(datos);
    } catch (err) {
      console.error("Error al cargar materias:", err);
      setError("No se pudieron cargar las materias. Intenta nuevamente.");
    } finally {
      setCargando(false);
    }
  }, []);

  // Carga inicial de materias al abrir la página.
  useEffect(() => {
    void cargarMaterias();
  }, [cargarMaterias]);

  // Calcula los indicadores a partir de los datos reales.
  const estadisticas = useMemo(() => {
    const activas = materias.filter(
      (materia) => materia.estado === "ACTIVA",
    ).length;

    const inactivas = materias.filter(
      (materia) => materia.estado === "INACTIVA",
    ).length;

    return {
      total: materias.length,
      activas,
      inactivas,
    };
  }, [materias]);

  // Aplica la búsqueda y el filtro de estado.
  const materiasFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return materias.filter((materia) => {
      const coincideBusqueda =
        termino === "" ||
        String(materia.id_materia).includes(termino) ||
        materia.nombre.toLowerCase().includes(termino) ||
        (materia.descripcion ?? "").toLowerCase().includes(termino);

      const coincideEstado =
        filtroEstado === "TODAS" || materia.estado === filtroEstado;

      return coincideBusqueda && coincideEstado;
    });
  }, [materias, busqueda, filtroEstado]);

  // Elimina una materia después de solicitar confirmación.
  const handleEliminar = async (materia: Materia) => {
    const confirmar = window.confirm(
      `¿Estás seguro de eliminar la materia "${materia.nombre}"?`,
    );

    if (!confirmar) return;

    try {
      setEliminandoId(materia.id_materia);
      setError("");

      await eliminarMateria(materia.id_materia);

      // Actualiza la tabla después de eliminar.
      await cargarMaterias();

      window.alert("Materia eliminada correctamente.");
    } catch (err) {
      console.error("Error al eliminar materia:", err);

      window.alert(
        "No se pudo eliminar la materia. Puede tener grupos o matrículas asociados.",
      );
    } finally {
      setEliminandoId(null);
    }
  };

  // Actualiza la tabla después de registrar una materia.
  const handleMateriaCreada = async () => {
    setMostrarFormulario(false);
    await cargarMaterias();
  };

  // Actualiza la tabla después de editar una materia.
  const handleMateriaActualizada = async () => {
    setMateriaSeleccionada(null);
    await cargarMaterias();
  };

  // Alterna entre el formulario de registro y la tabla.
  const alternarFormulario = () => {
    setMateriaSeleccionada(null);
    setMostrarFormulario((actual) => !actual);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Encabezado de la página */}
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950 via-indigo-800 to-blue-700 p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-lg bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-100">
                Administración académica
              </span>
            </div>

            <h1 className="text-2xl font-bold sm:text-3xl">
              Gestión de materias
            </h1>

            <p className="mt-2 max-w-xl text-sm text-indigo-100 sm:text-base">
              Administra las materias, sus créditos, costos y disponibilidad
              dentro del sistema académico.
            </p>
          </div>

          <button
            type="button"
            onClick={alternarFormulario}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-800 shadow-md transition hover:bg-indigo-50"
          >
            <span className="text-lg">{mostrarFormulario ? "×" : "+"}</span>
            {mostrarFormulario ? "Cerrar formulario" : "Nueva materia"}
          </button>
        </div>
      </section>

      {/* Indicadores */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Total de materias
            </p>
            <span className="rounded-xl bg-indigo-50 p-3 text-xl">📚</span>
          </div>

          <p className="mt-3 text-3xl font-bold text-slate-800">
            {estadisticas.total}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Materias registradas en el sistema
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Materias activas
            </p>
            <span className="rounded-xl bg-emerald-50 p-3 text-xl">✓</span>
          </div>

          <p className="mt-3 text-3xl font-bold text-emerald-700">
            {estadisticas.activas}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Disponibles según su estado
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Materias inactivas
            </p>
            <span className="rounded-xl bg-slate-100 p-3 text-xl">◷</span>
          </div>

          <p className="mt-3 text-3xl font-bold text-slate-600">
            {estadisticas.inactivas}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            No disponibles para nuevos grupos
          </p>
        </div>
      </section>

      {/* Formulario de registro */}
      {mostrarFormulario && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-800">
              Registrar nueva materia
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Completa los datos para incorporar una materia al sistema.
            </p>
          </div>

          <MateriaFormulario onMateriaCreada={handleMateriaCreada} />
        </section>
      )}

      {/* Formulario de edición */}
      {materiaSeleccionada && (
        <section className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-800">Editar materia</h2>
            <p className="mt-1 text-sm text-slate-500">
              Modifica la información de {materiaSeleccionada.nombre}.
            </p>
          </div>

          <MateriaEditarFormulario
            materia={materiaSeleccionada}
            onMateriaActualizada={handleMateriaActualizada}
            onCancelar={() => setMateriaSeleccionada(null)}
          />
        </section>
      )}

      {/* Listado de materias */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Materias registradas
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Consulta y administra las materias del sistema.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void cargarMaterias()}
              disabled={cargando}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed"
            >
              ↻ Actualizar
            </button>
          </div>

          {/* Buscador y filtro */}
          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
            <div>
              <label
                htmlFor="buscar-materia"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                Buscar materia
              </label>

              <input
                id="buscar-materia"
                type="search"
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                placeholder="Buscar por nombre, descripción o ID..."
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="filtro-estado-materia"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                Filtrar por estado
              </label>

              <select
                id="filtro-estado-materia"
                value={filtroEstado}
                onChange={(event) =>
                  setFiltroEstado(event.target.value as FiltroEstado)
                }
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              >
                <option value="TODAS">Todos los estados</option>
                <option value="ACTIVA">Activas</option>
                <option value="INACTIVA">Inactivas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error de carga */}
        {error && (
          <div className="m-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-semibold">No se pudo completar la operación</p>
            <p className="mt-1">{error}</p>

            <button
              type="button"
              onClick={() => void cargarMaterias()}
              className="mt-3 font-semibold underline"
            >
              Intentar nuevamente
            </button>
          </div>
        )}

        {/* Contenido de la tabla */}
        {cargando ? (
          <div className="flex flex-col items-center justify-center px-6 py-16">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
            <p className="mt-4 text-sm font-medium text-slate-500">
              Cargando materias...
            </p>
          </div>
        ) : materiasFiltradas.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
              📚
            </div>

            <h3 className="mt-4 font-semibold text-slate-800">
              {materias.length === 0
                ? "Todavía no hay materias registradas"
                : "No se encontraron materias"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {materias.length === 0
                ? "Puedes comenzar registrando una nueva materia."
                : "Prueba modificando el texto de búsqueda o el filtro de estado."}
            </p>

            {materias.length === 0 && (
              <button
                type="button"
                onClick={() => {
                  setMateriaSeleccionada(null);
                  setMostrarFormulario(true);
                }}
                className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                + Registrar materia
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-5 py-3 text-xs text-slate-500">
              <span>
                Mostrando{" "}
                <strong className="text-slate-700">
                  {materiasFiltradas.length}
                </strong>{" "}
                de {materias.length} materias
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[850px] w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">ID</th>
                    <th className="px-5 py-4 font-semibold">Materia</th>
                    <th className="px-5 py-4 text-center font-semibold">
                      Créditos
                    </th>
                    <th className="px-5 py-4 font-semibold">Inscripción</th>
                    <th className="px-5 py-4 font-semibold">Mensualidad</th>
                    <th className="px-5 py-4 font-semibold">Estado</th>
                    <th className="px-5 py-4 text-center font-semibold">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {materiasFiltradas.map((materia) => (
                    <tr
                      key={materia.id_materia}
                      className="transition hover:bg-indigo-50/40"
                    >
                      <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-500">
                        #{materia.id_materia}
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800">
                          {materia.nombre}
                        </p>
                        <p className="mt-1 max-w-xs text-xs text-slate-500">
                          {materia.descripcion || "Sin descripción"}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex rounded-lg bg-indigo-50 px-3 py-1 font-semibold text-indigo-700">
                          {materia.creditos}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-700">
                        {formatearMoneda(materia.costos_inscripcion)}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-700">
                        {formatearMoneda(materia.costo_mensual)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                            materia.estado === "ACTIVA"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              materia.estado === "ACTIVA"
                                ? "bg-emerald-500"
                                : "bg-slate-400"
                            }`}
                          />
                          {materia.estado}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            disabled={eliminandoId !== null}
                            onClick={() => {
                              setMostrarFormulario(false);
                              setMateriaSeleccionada(materia);
                            }}
                            className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            disabled={eliminandoId !== null}
                            onClick={() => void handleEliminar(materia)}
                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {eliminandoId === materia.id_materia
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
          </>
        )}
      </section>
    </div>
  );
}
