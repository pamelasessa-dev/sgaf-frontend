import type { Grupo } from "../../../types/grupo";

interface SelectorGrupoProps {
  grupos: Grupo[];
  grupoSeleccionado: number | null;
  onSeleccionar: (idGrupo: number) => void;
}

export default function SelectorGrupo({
  grupos,
  grupoSeleccionado,
  onSeleccionar,
}: SelectorGrupoProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <label
        htmlFor="grupo"
        className="mb-2 block text-sm font-semibold text-gray-700"
      >
        Seleccionar grupo
      </label>

      <select
        id="grupo"
        value={grupoSeleccionado ?? ""}
        onChange={(e) => onSeleccionar(Number(e.target.value))}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      >
        <option value="" disabled>
          Selecciona un grupo
        </option>

        {grupos.map((grupo) => (
          <option key={grupo.id_grupo} value={grupo.id_grupo}>
            {grupo.nombre} - {grupo.materia?.nombre ?? "Sin materia"}
          </option>
        ))}
      </select>

      {grupos.length === 0 && (
        <p className="mt-2 text-sm text-gray-500">
          No tienes grupos asignados actualmente.
        </p>
      )}
    </div>
  );
}
