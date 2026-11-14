import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import {
  aprobarPago,
  obtenerPagos,
  rechazarPago,
} from "../../../services/finanzasService";

import type { EstadoPago, PagoFinanciero } from "../../../types/matricula";

type FiltroPago = "TODOS" | EstadoPago;

const formatearImporte = (importe: string | number) => {
  const numero = Number(importe);

  if (!Number.isFinite(numero)) return importe;

  return new Intl.NumberFormat("es-UY", {
    maximumFractionDigits: 2,
  }).format(numero);
};

const formatearFecha = (fecha: string) => {
  if (!fecha) return "No disponible";

  const fechaValida = new Date(fecha);

  if (Number.isNaN(fechaValida.getTime())) return "No disponible";

  return fechaValida.toLocaleDateString("es-UY");
};

const obtenerNombreEstudiante = (pago: PagoFinanciero) => {
  const usuario = pago.obligacion?.estudiante?.usuario;

  if (!usuario) return "Estudiante no disponible";

  return `${usuario.primer_nombre} ${usuario.primer_apellido}`;
};

const obtenerNombreConcepto = (concepto?: string) => {
  switch (concepto) {
    case "INSCRIPCION":
      return "Inscripción";
    case "MENSUALIDAD":
      return "Mensualidad";
    case "OTRO":
      return "Otro";
    default:
      return "No disponible";
  }
};

const obtenerNombreEstado = (estado: EstadoPago) => {
  switch (estado) {
    case "PENDIENTE":
      return "Pendiente";
    case "APROBADO":
      return "Aprobado";
    case "RECHAZADO":
      return "Rechazado";
    default:
      return estado;
  }
};

export default function PagosPage() {
  const [pagos, setPagos] = useState<PagoFinanciero[]>([]);
  const [filtro, setFiltro] = useState<FiltroPago>("TODOS");

  const [cargando, setCargando] = useState(true);
  const [procesandoId, setProcesandoId] = useState<number | null>(null);

  const [rechazoId, setRechazoId] = useState<number | null>(null);
  const [observacion, setObservacion] = useState("");

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const cargarPagos = useCallback(async () => {
    setCargando(true);
    setError("");

    try {
      const datos = await obtenerPagos();
      setPagos(datos);
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los pagos.",
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargarPagos();
  }, [cargarPagos]);

  const pagosFiltrados = useMemo(() => {
    if (filtro === "TODOS") return pagos;

    return pagos.filter((pago) => pago.estado === filtro);
  }, [pagos, filtro]);

  const cantidadPendientes = pagos.filter(
    (pago) => pago.estado === "PENDIENTE",
  ).length;

  const cantidadAprobados = pagos.filter(
    (pago) => pago.estado === "APROBADO",
  ).length;

  const cantidadRechazados = pagos.filter(
    (pago) => pago.estado === "RECHAZADO",
  ).length;

  const manejarAprobacion = async (id: number) => {
    setProcesandoId(id);
    setError("");
    setMensaje("");
    setRechazoId(null);

    try {
      await aprobarPago(id);
      setMensaje("El pago fue aprobado correctamente.");
      await cargarPagos();
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "No se pudo aprobar el pago.",
      );
    } finally {
      setProcesandoId(null);
    }
  };

  const manejarRechazo = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    if (rechazoId === null) return;

    const motivo = observacion.trim();

    if (motivo.length < 5) {
      setError("El motivo del rechazo debe tener al menos 5 caracteres.");
      return;
    }

    const id = rechazoId;

    setProcesandoId(id);
    setError("");
    setMensaje("");

    try {
      await rechazarPago(id, { observacion: motivo });

      setMensaje("El pago fue rechazado correctamente.");
      setRechazoId(null);
      setObservacion("");

      await cargarPagos();
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "No se pudo rechazar el pago.",
      );
    } finally {
      setProcesandoId(null);
    }
  };

  return (
    <section className="space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Gestión de pagos</h1>

        <p className="mt-1 text-sm text-gray-500">
          Consultá los pagos registrados y gestioná las solicitudes pendientes.
        </p>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-700">Pendientes</p>
          <p className="mt-1 text-2xl font-bold text-yellow-800">
            {cantidadPendientes}
          </p>
        </div>

        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-sm text-green-700">Aprobados</p>
          <p className="mt-1 text-2xl font-bold text-green-800">
            {cantidadAprobados}
          </p>
        </div>

        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">Rechazados</p>
          <p className="mt-1 text-2xl font-bold text-red-800">
            {cantidadRechazados}
          </p>
        </div>
      </div>

      {/* Filtro y actualización */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <label
            htmlFor="filtro-pagos"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Filtrar por estado
          </label>

          <select
            id="filtro-pagos"
            value={filtro}
            onChange={(evento) => setFiltro(evento.target.value as FiltroPago)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="TODOS">Todos los pagos</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="APROBADO">Aprobados</option>
            <option value="RECHAZADO">Rechazados</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => void cargarPagos()}
          disabled={cargando}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Actualizar listado
        </button>
      </div>

      {/* Mensajes */}
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {mensaje && (
        <div
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
        >
          {mensaje}
        </div>
      )}

      {/* Listado */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        {cargando ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Cargando pagos...
          </div>
        ) : pagosFiltrados.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No hay pagos para mostrar.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    Pago
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    Estudiante
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    Concepto
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    Fecha
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">
                    Importe
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    Método
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {pagosFiltrados.map((pago) => (
                  <tr key={pago.id_pago} className="align-top hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-4 font-medium text-gray-800">
                      #{pago.id_pago}
                    </td>

                    <td className="px-4 py-4 text-gray-700">
                      {obtenerNombreEstudiante(pago)}
                    </td>

                    <td className="px-4 py-4 text-gray-700">
                      {obtenerNombreConcepto(pago.obligacion?.concepto)}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                      {formatearFecha(pago.fecha_pago)}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-right font-medium text-gray-800">
                      {formatearImporte(pago.monto)}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                      {pago.metodo}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          pago.estado === "PENDIENTE"
                            ? "bg-yellow-100 text-yellow-800"
                            : pago.estado === "APROBADO"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {obtenerNombreEstado(pago.estado)}
                      </span>
                    </td>

                    <td className="min-w-56 px-4 py-4">
                      {pago.estado === "PENDIENTE" ? (
                        <div className="space-y-2">
                          <button
                            type="button"
                            onClick={() => void manejarAprobacion(pago.id_pago)}
                            disabled={procesandoId !== null}
                            className="w-full rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {procesandoId === pago.id_pago
                              ? "Procesando..."
                              : "Aprobar pago"}
                          </button>

                          {rechazoId === pago.id_pago ? (
                            <form
                              onSubmit={manejarRechazo}
                              className="space-y-2"
                            >
                              <textarea
                                value={observacion}
                                onChange={(evento) =>
                                  setObservacion(evento.target.value)
                                }
                                rows={3}
                                maxLength={500}
                                placeholder="Indicá el motivo del rechazo..."
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs"
                                required
                              />

                              <button
                                type="submit"
                                disabled={
                                  procesandoId !== null ||
                                  observacion.trim().length < 5
                                }
                                className="w-full rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Confirmar rechazo
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setRechazoId(null);
                                  setObservacion("");
                                  setError("");
                                }}
                                disabled={procesandoId !== null}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50"
                              >
                                Cancelar
                              </button>
                            </form>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setRechazoId(pago.id_pago);
                                setObservacion("");
                                setError("");
                              }}
                              disabled={procesandoId !== null}
                              className="w-full rounded-lg border border-red-300 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Rechazar pago
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">
                          Sin acciones disponibles
                        </span>
                      )}

                      {pago.observacion && (
                        <p className="mt-2 max-w-56 text-xs text-gray-500">
                          Observación: {pago.observacion}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500">
        Los pagos pendientes todavía no se consideran aprobados. La obligación
        se actualizará según la confirmación del backend.
      </p>
    </section>
  );
}
