/**
 * Pantalla de permiso insuficiente.
 * El usuario sigue autenticado: puede volver a su panel.
 */

import { Link } from "react-router-dom";

interface AccesoDenegadoProps {
  mensaje?: string;
  volverA?: string;
  onCerrar?: () => void;
}

export function AccesoDenegado({
  mensaje = "No tienes permiso para acceder a esta sección.",
  volverA,
  onCerrar,
}: AccesoDenegadoProps) {
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
        Acceso denegado
      </p>
      <h2 className="mt-2 text-xl font-bold">No puedes realizar esta acción</h2>
      <p className="mt-3 text-sm leading-6">{mensaje}</p>
      <p className="mt-2 text-sm text-amber-800">
        Tu sesión sigue activa. Este aviso no cierra tu cuenta.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        {volverA && (
          <Link
            to={volverA}
            className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-800"
          >
            Volver a mi panel
          </Link>
        )}
        {onCerrar && (
          <button
            type="button"
            onClick={onCerrar}
            className="rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-100"
          >
            Entendido
          </button>
        )}
      </div>
    </section>
  );
}
