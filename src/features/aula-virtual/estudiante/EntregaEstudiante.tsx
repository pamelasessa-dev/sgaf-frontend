import { useState } from "react";

import { crearEntrega } from "../../../services/entregaService";

import type {
  ActividadAcademica,
  EntregaAcademica,
} from "../../../types/aulaVirtual";

interface EntregaEstudianteProps {
  actividad: ActividadAcademica;
  entrega?: EntregaAcademica;
  onEntregaCreada: (entrega: EntregaAcademica) => void;
}

export default function EntregaEstudiante({
  actividad,
  entrega,
  onEntregaCreada,
}: EntregaEstudianteProps) {
  const [respuestaTexto, setRespuestaTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const ahora = new Date();
  const apertura = new Date(actividad.fecha_apertura);
  const cierre = new Date(actividad.fecha_cierre);

  const antesDeAbrir = ahora < apertura;
  const plazoVencido = ahora > cierre;
  const disponible =
    actividad.estado === "ABIERTA" && !antesDeAbrir && !plazoVencido;

  const fecha = (valor: string) => new Date(valor).toLocaleString("es-UY");

  const enviarEntrega = async (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    if (!respuestaTexto.trim()) {
      setError("Escribe una respuesta antes de enviar.");
      return;
    }

    try {
      setEnviando(true);
      setError("");

      const nuevaEntrega = await crearEntrega({
        id_actividad: actividad.id_actividad,
        respuesta_texto: respuestaTexto.trim(),
      });

      onEntregaCreada(nuevaEntrega);
      setRespuestaTexto("");
    } catch {
      setError(
        "No fue posible enviar la entrega. Verifica el plazo y tu matrícula.",
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="mt-5 border-t border-gray-200 pt-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-semibold text-gray-800">Mi entrega</h4>

        {entrega ? (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            {entrega.estado}
          </span>
        ) : antesDeAbrir ? (
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
            Próximamente
          </span>
        ) : plazoVencido || actividad.estado === "CERRADA" ? (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
            Plazo vencido o actividad cerrada
          </span>
        ) : (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            Disponible
          </span>
        )}
      </div>

      <p className="mb-4 text-sm text-gray-500">
        Apertura: {fecha(actividad.fecha_apertura)}
        <br />
        Fecha límite: {fecha(actividad.fecha_cierre)}
      </p>

      {entrega ? (
        <div className="space-y-3 rounded-lg bg-gray-50 p-4">
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">
              Fecha de entrega
            </p>
            <p className="text-sm text-gray-700">
              {fecha(entrega.fecha_entrega)}
            </p>
          </div>

          {entrega.respuesta_texto && (
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500">
                Respuesta enviada
              </p>
              <p className="whitespace-pre-wrap text-sm text-gray-700">
                {entrega.respuesta_texto}
              </p>
            </div>
          )}

          {entrega.archivo_url && (
            <a
              href={entrega.archivo_url}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-indigo-600 hover:underline"
            >
              Consultar archivo entregado
            </a>
          )}

          {entrega.estado === "CALIFICADA" && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <p className="text-sm font-semibold text-green-800">
                Calificación
              </p>
              <p className="mt-1 text-2xl font-bold text-green-700">
                {entrega.puntaje_obtenido} / {actividad.puntaje_maximo}
              </p>

              {entrega.observacion_docente && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-green-800">
                    Observación del profesor
                  </p>
                  <p className="mt-1 text-sm text-green-700">
                    {entrega.observacion_docente}
                  </p>
                </div>
              )}
            </div>
          )}

          {entrega.estado === "ENTREGADA" && (
            <p className="text-sm text-blue-700">
              Tu entrega fue enviada y está pendiente de calificación.
            </p>
          )}
        </div>
      ) : disponible ? (
        <form onSubmit={enviarEntrega} className="space-y-3">
          <label
            htmlFor={`respuesta-${actividad.id_actividad}`}
            className="block text-sm font-medium text-gray-700"
          >
            Escribe tu respuesta
          </label>

          <textarea
            id={`respuesta-${actividad.id_actividad}`}
            value={respuestaTexto}
            onChange={(evento) => setRespuestaTexto(evento.target.value)}
            rows={5}
            maxLength={10000}
            placeholder="Escribe aquí tu trabajo o respuesta..."
            className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            disabled={enviando}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={enviando || !respuestaTexto.trim()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {enviando ? "Enviando..." : "Enviar entrega"}
          </button>
        </form>
      ) : (
        <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
          {antesDeAbrir
            ? "Podrás enviar tu respuesta cuando llegue la fecha de apertura."
            : "Ya no es posible enviar una entrega para esta actividad."}
        </p>
      )}
    </div>
  );
}
