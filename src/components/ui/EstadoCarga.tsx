/**
 * Estado de espera reutilizable.
 * Se usa mientras una consulta está en curso y como fallback de Suspense.
 */

interface EstadoCargaProps {
  mensaje?: string;
}

export function EstadoCarga({
  mensaje = "Cargando información...",
}: EstadoCargaProps) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-6 text-slate-600"
      role="status"
      aria-live="polite"
    >
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-700" />
      <p>{mensaje}</p>
    </div>
  );
}
