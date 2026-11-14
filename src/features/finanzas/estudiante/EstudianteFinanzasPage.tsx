import { useEffect, useMemo, useState } from "react";
import {
  obtenerMisObligaciones,
  registrarPago,
} from "../../../services/finanzasService";
import type {
  ConceptoObligacion,
  MetodoPago,
  ObligacionFinanciera,
} from "../../../types/matricula";

const formatearImporte = (importe: string | number) => {
  const numero = Number(importe);

  if (!Number.isFinite(numero)) return "—";

  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
    maximumFractionDigits: 2,
  }).format(numero);
};

const formatearFecha = (fecha: string) => {
  if (!fecha) return "—";

  return new Intl.DateTimeFormat("es-UY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(fecha));
};

const obtenerNombreConcepto = (concepto: ConceptoObligacion) => {
  const nombres: Record<ConceptoObligacion, string> = {
    INSCRIPCION: "Inscripción",
    MENSUALIDAD: "Mensualidad",
    OTRO: "Otro concepto",
  };

  return nombres[concepto] ?? concepto;
};

const obtenerColorEstado = (estado: string) => {
  switch (estado) {
    case "PAGADA":
    case "APROBADO":
      return "bg-green-100 text-green-700";

    case "PENDIENTE":
      return "bg-yellow-100 text-yellow-700";

    case "VENCIDA":
    case "RECHAZADO":
      return "bg-red-100 text-red-700";

    case "CANCELADA":
      return "bg-gray-100 text-gray-600";

    default:
      return "bg-gray-100 text-gray-600";
  }
};

const obtenerSaldo = (obligacion: ObligacionFinanciera) => {
  // Una obligación pagada o cancelada no tiene saldo pendiente.
  if (obligacion.estado === "PAGADA" || obligacion.estado === "CANCELADA") {
    return 0;
  }

  // Los pagos pendientes y aprobados comprometen el importe.
  const comprometido = obligacion.pagos
    .filter((pago) => pago.estado === "PENDIENTE" || pago.estado === "APROBADO")
    .reduce((total, pago) => total + Number(pago.monto), 0);

  return Math.max(0, Number(obligacion.monto) - comprometido);
};

const obtenerMontoPagado = (obligacion: ObligacionFinanciera) => {
  return obligacion.pagos
    .filter((pago) => pago.estado === "APROBADO")
    .reduce((total, pago) => total + Number(pago.monto), 0);
};

export default function EstudianteFinanzasPage() {
  const [obligaciones, setObligaciones] = useState<ObligacionFinanciera[]>([]);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [obligacionSeleccionada, setObligacionSeleccionada] = useState("");

  const [monto, setMonto] = useState("");
  const [metodo, setMetodo] = useState<MetodoPago>("TRANSFERENCIA");

  const [registrando, setRegistrando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [errorPago, setErrorPago] = useState("");
  const tieneObligacionesVencidas = obligaciones.some(
    (obligacion) => obligacion.estado === "VENCIDA",
  );
  const cargarObligaciones = async () => {
    try {
      setCargando(true);
      setError("");

      const datos = await obtenerMisObligaciones();

      setObligaciones(datos);
    } catch (err) {
      console.error("Error al cargar las obligaciones:", err);
      setError("No fue posible cargar tus obligaciones financieras.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    void cargarObligaciones();
  }, []);

  const obligacionesDisponibles = useMemo(
    () =>
      obligaciones.filter(
        (obligacion) =>
          obligacion.estado !== "PAGADA" &&
          obligacion.estado !== "CANCELADA" &&
          obtenerSaldo(obligacion) > 0,
      ),
    [obligaciones],
  );

  const obligacionActual = obligacionesDisponibles.find(
    (obligacion) => String(obligacion.id_obligacion) === obligacionSeleccionada,
  );

  const totalObligaciones = obligaciones.reduce(
    (total, obligacion) => total + Number(obligacion.monto),
    0,
  );

  const totalPagado = obligaciones.reduce(
    (total, obligacion) => total + obtenerMontoPagado(obligacion),
    0,
  );

  const saldoPendiente = obligaciones.reduce(
    (total, obligacion) => total + obtenerSaldo(obligacion),
    0,
  );

  const pagos = obligaciones
    .flatMap((obligacion) =>
      obligacion.pagos.map((pago) => ({
        ...pago,
        concepto: obligacion.concepto,
      })),
    )
    .sort(
      (a, b) =>
        new Date(b.fecha_pago).getTime() - new Date(a.fecha_pago).getTime(),
    );

  const manejarSeleccionObligacion = (valor: string) => {
    setObligacionSeleccionada(valor);
    setMonto("");
    setMensaje("");
    setErrorPago("");
  };

  const manejarRegistroPago = async (
    evento: React.FormEvent<HTMLFormElement>,
  ) => {
    evento.preventDefault();

    setMensaje("");
    setErrorPago("");

    if (!obligacionActual) {
      setErrorPago("Selecciona una obligación pendiente.");
      return;
    }

    const montoNumerico = Number(monto);
    const saldoDisponible = obtenerSaldo(obligacionActual);

    if (!Number.isFinite(montoNumerico) || montoNumerico <= 0) {
      setErrorPago("Ingresa un importe válido mayor que cero.");
      return;
    }

    if (Math.round(montoNumerico * 100) / 100 > saldoDisponible) {
      setErrorPago(
        `El importe supera el saldo disponible de ${formatearImporte(
          saldoDisponible,
        )}.`,
      );
      return;
    }

    try {
      setRegistrando(true);

      const pago = await registrarPago({
        id_obligacion: obligacionActual.id_obligacion,
        monto: montoNumerico,
        metodo,
      });

      if (metodo === "PASARELA") {
        if (pago.checkout_url) {
          window.location.assign(pago.checkout_url);
          return;
        }

        setErrorPago(
          "El pago fue registrado, pero no se recibió una dirección de checkout de MockPay. Actualiza tus obligaciones para consultar su estado.",
        );

        await cargarObligaciones();
        return;
      }

      setMensaje(
        "Tu pago fue registrado correctamente y quedó pendiente de validación.",
      );

      setMonto("");
      setObligacionSeleccionada("");

      await cargarObligaciones();
    } catch (err) {
      console.error("Error al registrar el pago:", err);

      setErrorPago(
        "No fue posible registrar el pago. Verifica el saldo disponible y vuelve a intentarlo.",
      );
    } finally {
      setRegistrando(false);
    }
  };

  if (cargando) {
    return (
      <div className="flex justify-center p-10">
        <p className="text-gray-500">Cargando información financiera...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-5">
        <p className="text-red-700">{error}</p>

        <button
          onClick={() => void cargarObligaciones()}
          className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Mis finanzas</h1>

        <p className="mt-1 text-sm text-gray-500">
          Consulta tus obligaciones financieras y los pagos realizados.
        </p>
      </div>

      {tieneObligacionesVencidas && (
        <div
          className="rounded-xl border border-red-300 bg-red-50 p-5"
          role="alert"
        >
          <h2 className="font-bold text-red-800">
            Atención: tienes obligaciones financieras vencidas
          </h2>

          <p className="mt-2 text-sm leading-6 text-red-700">
            Tu cuenta puede estar suspendida por mora. Mientras tengas
            obligaciones vencidas, podrías tener restricciones para matricularte
            o entregar actividades. Contacta a Recepción para regularizar tu
            situación.
          </p>
        </div>
      )}

      {/* Resumen financiero */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total de obligaciones</p>

          <p className="mt-2 text-2xl font-bold text-gray-800">
            {formatearImporte(totalObligaciones)}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total pagado y aprobado</p>

          <p className="mt-2 text-2xl font-bold text-green-600">
            {formatearImporte(totalPagado)}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Saldo pendiente de cubrir</p>

          <p className="mt-2 text-2xl font-bold text-orange-600">
            {formatearImporte(saldoPendiente)}
          </p>
        </div>
      </section>

      {/* Obligaciones */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Mis obligaciones
          </h2>

          <p className="text-sm text-gray-500">
            Detalle de los importes asociados a tus matrículas.
          </p>
        </div>

        {obligaciones.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">
              No tienes obligaciones financieras registradas.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3">Concepto</th>
                  <th className="px-4 py-3">Emisión</th>
                  <th className="px-4 py-3">Vencimiento</th>
                  <th className="px-4 py-3">Importe</th>
                  <th className="px-4 py-3">Pagado</th>
                  <th className="px-4 py-3">Saldo</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {obligaciones.map((obligacion) => (
                  <tr key={obligacion.id_obligacion}>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {obtenerNombreConcepto(obligacion.concepto)}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {formatearFecha(obligacion.fecha_emision)}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {formatearFecha(obligacion.fecha_vencimiento)}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {formatearImporte(obligacion.monto)}
                    </td>

                    <td className="px-4 py-3 text-green-700">
                      {formatearImporte(obtenerMontoPagado(obligacion))}
                    </td>

                    <td className="px-4 py-3 font-medium text-gray-800">
                      {formatearImporte(obtenerSaldo(obligacion))}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${obtenerColorEstado(
                          obligacion.estado,
                        )}`}
                      >
                        {obligacion.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Registro de pago */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-800">
            Registrar un pago
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Puedes realizar pagos parciales o cubrir el saldo completo.
          </p>
        </div>

        {obligacionesDisponibles.length === 0 ? (
          <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
            No tienes obligaciones con saldo disponible para pagar.
          </p>
        ) : (
          <form onSubmit={manejarRegistroPago} className="max-w-2xl space-y-4">
            <div>
              <label
                htmlFor="obligacion"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Obligación
              </label>

              <select
                id="obligacion"
                value={obligacionSeleccionada}
                onChange={(evento) =>
                  manejarSeleccionObligacion(evento.target.value)
                }
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Selecciona una obligación</option>

                {obligacionesDisponibles.map((obligacion) => (
                  <option
                    key={obligacion.id_obligacion}
                    value={obligacion.id_obligacion}
                  >
                    {obtenerNombreConcepto(obligacion.concepto)} — Saldo:{" "}
                    {formatearImporte(obtenerSaldo(obligacion))}
                  </option>
                ))}
              </select>
            </div>

            {obligacionActual && (
              <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                Saldo disponible para esta obligación:{" "}
                <strong>
                  {formatearImporte(obtenerSaldo(obligacionActual))}
                </strong>
              </div>
            )}

            <div>
              <label
                htmlFor="monto"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Importe a pagar
              </label>

              <input
                id="monto"
                type="number"
                min="0.01"
                step="0.01"
                max={
                  obligacionActual ? obtenerSaldo(obligacionActual) : undefined
                }
                value={monto}
                onChange={(evento) => setMonto(evento.target.value)}
                placeholder="Ingresa el importe"
                required
                disabled={!obligacionActual}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="metodo"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Método de pago
              </label>

              <select
                id="metodo"
                value={metodo}
                onChange={(evento) =>
                  setMetodo(evento.target.value as MetodoPago)
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="TRANSFERENCIA">Transferencia</option>

                <option value="EFECTIVO">Efectivo</option>

                <option value="PASARELA">Pasarela de pago (MockPay)</option>
              </select>
            </div>

            {metodo === "PASARELA" && (
              <div className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
                Al continuar, serás redirigido a MockPay para completar el pago
                electrónico.
              </div>
            )}

            {mensaje && (
              <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                {mensaje}
              </div>
            )}

            {errorPago && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {errorPago}
              </div>
            )}

            <button
              type="submit"
              disabled={registrando || !obligacionActual}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {registrando
                ? "Registrando pago..."
                : metodo === "PASARELA"
                  ? "Continuar a MockPay"
                  : "Registrar pago"}
            </button>
          </form>
        )}
      </section>

      {/* Historial de pagos */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Historial de pagos
          </h2>

          <p className="text-sm text-gray-500">
            Consulta los pagos realizados y su estado de validación.
          </p>
        </div>

        {pagos.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">
              Todavía no tienes pagos registrados.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Concepto</th>
                  <th className="px-4 py-3">Método</th>
                  <th className="px-4 py-3">Importe</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Observación</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {pagos.map((pago) => (
                  <tr key={pago.id_pago}>
                    <td className="px-4 py-3 text-gray-600">
                      {formatearFecha(pago.fecha_pago)}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {obtenerNombreConcepto(pago.concepto)}
                    </td>

                    <td className="px-4 py-3 text-gray-600">{pago.metodo}</td>

                    <td className="px-4 py-3 font-medium text-gray-800">
                      {formatearImporte(pago.monto)}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${obtenerColorEstado(
                          pago.estado,
                        )}`}
                      >
                        {pago.estado}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-gray-500">
                      {pago.observacion || "—"}
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
