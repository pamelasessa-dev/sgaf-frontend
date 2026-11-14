/**
 * Se muestra cuando la consulta funcionó, pero no hay registros.
 */

interface EstadoVacioProps {
  titulo: string;
  descripcion?: string;
}

export function EstadoVacio({ titulo, descripcion }: EstadoVacioProps) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center">
      <p className="font-semibold text-slate-800">{titulo}</p>
      {descripcion && (
        <p className="mt-2 text-sm text-slate-500">{descripcion}</p>
      )}
    </div>
  );
}
