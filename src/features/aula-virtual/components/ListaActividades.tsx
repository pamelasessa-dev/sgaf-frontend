import type { ActividadAcademica } from "../../../types/aulaVirtual";
import ActividadCard from "./ActividadCard";

interface ListaActividadesProps {
  actividades: ActividadAcademica[];
  cargando: boolean;
  actividadProcesando: number | null;
  onEditar: (actividad: ActividadAcademica) => void;
  onVerEntregas: (actividad: ActividadAcademica) => void;
  onCambiarEstado: (
    actividad: ActividadAcademica,
    nuevoEstado: "ABIERTA" | "CERRADA",
  ) => void;
}

export default function ListaActividades({
  actividades,
  cargando,
  actividadProcesando,
  onEditar,
  onVerEntregas,
  onCambiarEstado,
}: ListaActividadesProps) {
  if (cargando) {
    return (
      <p className="py-8 text-center text-sm text-gray-500">
        Cargando actividades...
      </p>
    );
  }

  if (actividades.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
        <p className="font-medium text-gray-600">
          Todavía no hay actividades para este grupo.
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Puedes crear una nueva actividad cuando lo necesites.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {actividades.map((actividad) => (
        <ActividadCard
          key={actividad.id_actividad}
          actividad={actividad}
          actividadProcesando={actividadProcesando}
          onEditar={onEditar}
          onVerEntregas={onVerEntregas}
          onCambiarEstado={onCambiarEstado}
        />
      ))}
    </div>
  );
}
