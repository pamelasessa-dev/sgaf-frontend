import type { ActividadAcademica } from "../../../types/aulaVirtual";

interface ActividadCardProps {
  actividad: ActividadAcademica;
  actividadProcesando: number | null;
  onEditar: (actividad: ActividadAcademica) => void;
  onVerEntregas: (actividad: ActividadAcademica) => void;
  onCambiarEstado: (
    actividad: ActividadAcademica,
    nuevoEstado: "ABIERTA" | "CERRADA",
  ) => void;
}

export default function ActividadCard({
  actividad,
  actividadProcesando,
  onEditar,
  onVerEntregas,
  onCambiarEstado,
}: ActividadCardProps) {
  const procesando = actividadProcesando === actividad.id_actividad;

  const fechaCierre = new Date(actividad.fecha_cierre).toLocaleString("es-UY");

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-3 sm:flex-row">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {actividad.titulo}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {actividad.descripcion || "Sin descripción"}
          </p>
        </div>

        <span
          className={`h-fit rounded-full px-3 py-1 text-xs font-semibold ${
            actividad.estado === "ABIERTA"
              ? "bg-green-100 text-green-700"
              : actividad.estado === "CERRADA"
                ? "bg-gray-100 text-gray-600"
                : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {actividad.estado}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        <div>
          <p className="text-gray-500">Tipo</p>
          <p className="font-medium text-gray-700">{actividad.tipo}</p>
        </div>

        <div>
          <p className="text-gray-500">Puntaje máximo</p>
          <p className="font-medium text-gray-700">
            {actividad.puntaje_maximo}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Porcentaje</p>
          <p className="font-medium text-gray-700">
            {actividad.porcentaje_aporte}%
          </p>
        </div>

        <div className="col-span-2 sm:col-span-3">
          <p className="text-gray-500">Fecha de cierre</p>
          <p className="font-medium text-gray-700">{fechaCierre}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
        {actividad.estado !== "BORRADOR" && (
          <button
            type="button"
            onClick={() => onVerEntregas(actividad)}
            disabled={actividadProcesando !== null}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            Ver entregas y calificar
          </button>
        )}

        {actividad.estado === "BORRADOR" && (
          <>
            <button
              type="button"
              onClick={() => onEditar(actividad)}
              disabled={procesando || actividadProcesando !== null}
              className="rounded-lg border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50 disabled:opacity-50"
            >
              Editar
            </button>

            <button
              type="button"
              onClick={() => onCambiarEstado(actividad, "ABIERTA")}
              disabled={procesando || actividadProcesando !== null}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              {procesando ? "Publicando..." : "Publicar actividad"}
            </button>
          </>
        )}

        {actividad.estado === "ABIERTA" && (
          <button
            type="button"
            onClick={() => onCambiarEstado(actividad, "CERRADA")}
            disabled={procesando || actividadProcesando !== null}
            className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {procesando ? "Cerrando..." : "Cerrar actividad"}
          </button>
        )}

        {actividad.estado === "CERRADA" && (
          <span className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-500">
            Actividad finalizada
          </span>
        )}
      </div>
    </article>
  );
}
