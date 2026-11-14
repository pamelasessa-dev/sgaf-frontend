/**
 * Muestra un fallo de red, validación o regla de negocio.
 * El texto debe venir de extraerMensajeError para no inventar la causa.
 */

interface AlertaErrorProps {
  mensaje: string;
}

export function AlertaError({ mensaje }: AlertaErrorProps) {
  return (
    <p
      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
      role="alert"
    >
      {mensaje}
    </p>
  );
}
