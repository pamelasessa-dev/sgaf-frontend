/**
 * MatriculasPage.tsx
 *
 * Pantalla del estudiante para consultar sus matrículas
 * y solicitar nuevas materias.
 */

import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import {
  obtenerGruposDisponibles,
  obtenerMisMatriculas,
  solicitarMatricula,
} from "../../../services/matriculaService";

import type { GrupoMatricula, Matricula } from "../../../types/matricula";

// Formatea fechas sin alterar el día por diferencias de zona horaria.
const formatearFecha = (fecha: string): string => {
  if (!fecha) return "No disponible";

  const fechaCorta = fecha.slice(0, 10);
  const [anio, mes, dia] = fechaCorta.split("-");

  return `${dia}/${mes}/${anio}`;
};

// Formatea los importes recibidos desde el backend.
const formatearImporte = (importe: string | number) => {
  const numero = Number(importe);

  if (!Number.isFinite(numero)) return importe;

  return new Intl.NumberFormat("es-UY", {
    maximumFractionDigits: 2,
  }).format(numero);
};

// Obtiene un mensaje comprensible de los errores de la API.
const obtenerMensajeError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const mensaje = error.response?.data?.message;

    if (Array.isArray(mensaje)) {
      return mensaje.join(", ");
    }

    if (typeof mensaje === "string") {
      return mensaje;
    }

    if (!error.response) {
      return "No se pudo conectar con el servidor. Comprueba tu conexión.";
    }
  }

  return "Ocurrió un error inesperado. Intenta nuevamente.";
};

// Presenta visualmente los estados de las matrículas.
function EstadoMatriculaEtiqueta({ estado }: { estado: string }) {
  const estilos =
    estado === "ACTIVA"
      ? "bg-green-100 text-green-700"
      : "bg-amber-100 text-amber-700";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${estilos}`}
    >
      {estado}
    </span>
  );
}

// Presenta visualmente los estados financieros.
function EstadoFinancieroEtiqueta({ estado }: { estado: string }) {
  const estilos: Record<string, string> = {
    PAGADA: "bg-green-100 text-green-700",
    APROBADO: "bg-green-100 text-green-700",
    VENCIDA: "bg-red-100 text-red-700",
    RECHAZADO: "bg-red-100 text-red-700",
    CANCELADA: "bg-slate-100 text-slate-600",
    PENDIENTE: "bg-amber-100 text-amber-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        estilos[estado] ?? "bg-slate-100 text-slate-600"
      }`}
    >
      {estado}
    </span>
  );
}

export default function MatriculasPage() {
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [grupos, setGrupos] = useState<GrupoMatricula[]>([]);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [procesandoGrupo, setProcesandoGrupo] = useState<number | null>(null);

  const [pestana, setPestana] = useState<"matriculas" | "grupos">("matriculas");

  // Carga las matrículas y los grupos desde el backend.
  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setError("");

    try {
      const [misMatriculas, todosLosGrupos] = await Promise.all([
        obtenerMisMatriculas(),
        obtenerGruposDisponibles(),
      ]);

      setMatriculas(misMatriculas);
      setGrupos(todosLosGrupos);
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargarDatos();
  }, [cargarDatos]);

  // Solicita la matrícula del grupo seleccionado.
  const manejarSolicitud = async (idGrupo: number) => {
    const grupo = grupos.find((item) => item.id_grupo === idGrupo);

    if (!grupo) return;

    const confirmar = window.confirm(
      `¿Deseas solicitar la matrícula en ${grupo.materia.nombre} - ${grupo.nombre}?`,
    );

    if (!confirmar) return;

    setProcesandoGrupo(idGrupo);
    setError("");
    setMensaje("");

    try {
      await solicitarMatricula({ id_grupo: idGrupo });

      setMensaje(
        "Tu solicitud de matrícula fue registrada correctamente. Quedará pendiente hasta cumplir las condiciones de activación.",
      );

      await cargarDatos();
      setPestana("matriculas");
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setProcesandoGrupo(null);
    }
  };

  // Solo se muestran grupos abiertos de períodos activos.
  const gruposDisponibles = grupos.filter(
    (grupo) =>
      grupo.estado === "ABIERTO" &&
      grupo.periodo.estado === "ACTIVO" &&
      grupo.materia.estado === "ACTIVA",
  );

  // Evita ofrecer materias en las que el estudiante ya tiene matrícula.
  const gruposSinDuplicados = gruposDisponibles.filter(
    (grupo) =>
      !matriculas.some(
        (matricula) =>
          matricula.id_grupo === grupo.id_grupo ||
          (matricula.grupo.id_materia === grupo.id_materia &&
            matricula.grupo.id_periodo === grupo.id_periodo),
      ),
  );

  const totalActivas = matriculas.filter(
    (matricula) => matricula.estado === "ACTIVA",
  ).length;

  const totalPendientes = matriculas.filter(
    (matricula) => matricula.estado === "PENDIENTE",
  ).length;

  if (cargando) {
    return (
      <div className="flex min-h-72 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
          <p className="mt-4 text-sm text-slate-500">
            Cargando información de tus matrículas...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <p className="text-sm font-semibold text-indigo-600">
          GESTIÓN ACADÉMICA
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-800">
          Mis matrículas
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Consulta tus materias inscritas y solicita nuevas matrículas para el
          período académico activo.
        </p>
      </div>

      {/* Mensajes de error y éxito */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <p className="font-semibold">No se pudo completar la operación</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {mensaje && (
        <div
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
        >
          {mensaje}
        </div>
      )}

      {/* Indicadores */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total de matrículas</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">
            {matriculas.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Matrículas activas</p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {totalActivas}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Pendientes</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">
            {totalPendientes}
          </p>
        </div>
      </div>

      {/* Navegación entre secciones */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => {
            setPestana("matriculas");
            setError("");
            setMensaje("");
          }}
          className={`border-b-2 px-4 py-3 text-sm font-semibold transition ${
            pestana === "matriculas"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-indigo-600"
          }`}
        >
          Mis matrículas
        </button>

        <button
          type="button"
          onClick={() => {
            setPestana("grupos");
            setError("");
            setMensaje("");
          }}
          className={`border-b-2 px-4 py-3 text-sm font-semibold transition ${
            pestana === "grupos"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-indigo-600"
          }`}
        >
          Grupos disponibles
          <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700">
            {gruposSinDuplicados.length}
          </span>
        </button>
      </div>

      {/* Listado de matrículas */}
      {pestana === "matriculas" && (
        <section className="space-y-4">
          {matriculas.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <h2 className="font-semibold text-slate-700">
                Todavía no tienes matrículas
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Puedes explorar los grupos disponibles para solicitar una nueva
                matrícula.
              </p>

              <button
                type="button"
                onClick={() => setPestana("grupos")}
                className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Explorar grupos
              </button>
            </div>
          ) : (
            matriculas.map((matricula) => (
              <article
                key={matricula.id_matricula}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                      {matricula.grupo.periodo.nombre}
                    </p>

                    <h2 className="mt-1 text-lg font-bold text-slate-800">
                      {matricula.grupo.materia.nombre}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {matricula.grupo.nombre} ·{" "}
                      {matricula.grupo.materia.creditos} créditos
                    </p>
                  </div>

                  <EstadoMatriculaEtiqueta estado={matricula.estado} />
                </div>

                <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <p className="text-xs text-slate-500">Profesor</p>
                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {matricula.grupo.profesor.usuario.primer_nombre}{" "}
                      {matricula.grupo.profesor.usuario.primer_apellido}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Aula</p>
                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {matricula.grupo.aula.nombre}
                    </p>
                    <p className="text-xs text-slate-500">
                      {matricula.grupo.aula.ubicacion}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Fecha de matrícula</p>
                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {formatearFecha(matricula.fecha_matricula)}
                    </p>
                  </div>
                </div>

                {/* Horarios */}
                <div className="border-t border-slate-100 px-5 py-4">
                  <h3 className="text-sm font-semibold text-slate-700">
                    Horarios
                  </h3>

                  {matricula.grupo.horarios &&
                  matricula.grupo.horarios.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {matricula.grupo.horarios.map((horario) => (
                        <span
                          key={horario.id_horario}
                          className="rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-700"
                        >
                          {horario.dia_semana} ·{" "}
                          {horario.hora_inicio.slice(11, 16)} -{" "}
                          {horario.hora_fin.slice(11, 16)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-slate-500">
                      No hay horarios registrados para este grupo.
                    </p>
                  )}
                </div>

                {/* Obligaciones financieras */}
                <div className="border-t border-slate-100 bg-slate-50/70 p-5">
                  <h3 className="text-sm font-semibold text-slate-700">
                    Obligaciones financieras
                  </h3>

                  {matricula.obligaciones.length === 0 ? (
                    <p className="mt-2 text-sm text-slate-500">
                      No hay obligaciones asociadas a esta matrícula.
                    </p>
                  ) : (
                    <div className="mt-3 space-y-3">
                      {matricula.obligaciones.map((obligacion) => (
                        <div
                          key={obligacion.id_obligacion}
                          className="rounded-lg border border-slate-200 bg-white p-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="text-sm font-semibold text-slate-700">
                                {obligacion.concepto}
                              </p>

                              <p className="mt-1 text-sm text-slate-500">
                                Importe: {formatearImporte(obligacion.monto)}
                              </p>

                              <p className="text-xs text-slate-400">
                                Vencimiento:{" "}
                                {formatearFecha(obligacion.fecha_vencimiento)}
                              </p>
                            </div>

                            <EstadoFinancieroEtiqueta
                              estado={obligacion.estado}
                            />
                          </div>

                          {obligacion.pagos.length > 0 && (
                            <div className="mt-3 border-t border-slate-100 pt-3">
                              <p className="mb-2 text-xs font-semibold text-slate-500">
                                Pagos registrados
                              </p>

                              {obligacion.pagos.map((pago) => (
                                <div
                                  key={pago.id_pago}
                                  className="flex flex-wrap items-center justify-between gap-2 text-xs"
                                >
                                  <span className="text-slate-600">
                                    {pago.metodo} ·{" "}
                                    {formatearFecha(pago.fecha_pago)}
                                  </span>

                                  <EstadoFinancieroEtiqueta
                                    estado={pago.estado}
                                  />

                                  {pago.observacion && (
                                    <p className="w-full text-slate-500">
                                      {pago.observacion}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))
          )}
        </section>
      )}

      {/* Grupos disponibles */}
      {pestana === "grupos" && (
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Oferta académica
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Grupos abiertos pertenecientes a períodos activos.
            </p>
          </div>

          {gruposSinDuplicados.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <h3 className="font-semibold text-slate-700">
                No hay grupos disponibles
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Actualmente no encontramos grupos abiertos en períodos activos
                para los que no tengas una matrícula.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {gruposSinDuplicados.map((grupo) => (
                <article
                  key={grupo.id_grupo}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                        {grupo.periodo.nombre}
                      </p>

                      <h3 className="mt-1 text-lg font-bold text-slate-800">
                        {grupo.materia.nombre}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {grupo.nombre}
                      </p>
                    </div>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      ABIERTO
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-slate-600">
                    {grupo.materia.descripcion}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Créditos</p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {grupo.materia.creditos}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Cupo máximo</p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {grupo.cupo_maximo}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p>
                      <span className="font-medium text-slate-700">
                        Profesor:
                      </span>{" "}
                      {grupo.profesor.usuario.primer_nombre}{" "}
                      {grupo.profesor.usuario.primer_apellido}
                    </p>

                    <p>
                      <span className="font-medium text-slate-700">Aula:</span>{" "}
                      {grupo.aula.nombre} ({grupo.aula.tipo})
                    </p>

                    <p>
                      <span className="font-medium text-slate-700">
                        Período:
                      </span>{" "}
                      {formatearFecha(grupo.periodo.fecha_inicio)} al{" "}
                      {formatearFecha(grupo.periodo.fecha_fin)}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      disabled={procesandoGrupo !== null}
                      onClick={() => void manejarSolicitud(grupo.id_grupo)}
                      className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {procesandoGrupo === grupo.id_grupo
                        ? "Enviando solicitud..."
                        : "Solicitar matrícula"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Actualizar información */}
      <div className="flex justify-end border-t border-slate-200 pt-4">
        <button
          type="button"
          onClick={() => void cargarDatos()}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          Actualizar información
        </button>
      </div>
    </div>
  );
}
