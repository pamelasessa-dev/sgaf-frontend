import { useEffect, useState } from "react";

import {
  obtenerEntregasPorActividad,
  calificarEntrega,
} from "../../../services/entregaService";

import type {
  ActividadAcademica,
  EntregaAcademica,
} from "../../../types/aulaVirtual";

interface EntregasActividadProps {
  actividad: ActividadAcademica;
  onCerrar: () => void;
}

export default function EntregasActividad({
  actividad,
  onCerrar,
}: EntregasActividadProps) {
  const [entregas, setEntregas] = useState<EntregaAcademica[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [entregaSeleccionada, setEntregaSeleccionada] = useState<number | null>(
    null,
  );

  const [puntaje, setPuntaje] = useState("");
  const [observacion, setObservacion] = useState("");
  const [guardando, setGuardando] = useState(false);

  // Cargar entregas de la actividad.
  const cargarEntregas = async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await obtenerEntregasPorActividad(
        actividad.id_actividad,
      );

      setEntregas(respuesta);
    } catch {
      setError("No fue posible cargar las entregas de esta actividad.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    void cargarEntregas();
  }, [actividad.id_actividad]);

  // Abrir el formulario de calificación.
  const abrirCalificacion = (entrega: EntregaAcademica) => {
    setEntregaSeleccionada(entrega.id_entrega);
    setPuntaje(
      entrega.puntaje_obtenido !== null ? String(entrega.puntaje_obtenido) : "",
    );
    setObservacion(entrega.observacion_docente ?? "");
    setError("");
    setMensaje("");
  };

  // Guardar la calificación.
  const guardarCalificacion = async (idEntrega: number) => {
    const valor = Number(puntaje);
    const puntajeMaximo = Number(actividad.puntaje_maximo);

    if (
      puntaje.trim() === "" ||
      !Number.isFinite(valor) ||
      valor < 0 ||
      valor > puntajeMaximo ||
      !Number.isInteger(valor * 100)
    ) {
      setError(
        `Ingresa un puntaje válido entre 0 y ${puntajeMaximo}, con máximo dos decimales.`,
      );
      return;
    }

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      await calificarEntrega(idEntrega, {
        puntaje_obtenido: valor,
        observacion_docente: observacion.trim() || undefined,
      });

      setEntregaSeleccionada(null);
      setPuntaje("");
      setObservacion("");

      await cargarEntregas();

      setMensaje("La entrega se calificó correctamente.");
    } catch {
      setError(
        "No fue posible guardar la calificación. Verifica que la entrega todavía esté pendiente.",
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Entregas de la actividad
          </h2>

          <p className="text-sm text-gray-500">
            {actividad.titulo} · Puntaje máximo: {actividad.puntaje_maximo}
          </p>
        </div>

        <button
          type="button"
          onClick={onCerrar}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          Volver
        </button>
      </div>

      {mensaje && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {mensaje}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {cargando ? (
        <p className="py-8 text-center text-sm text-gray-500">
          Cargando entregas...
        </p>
      ) : entregas.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-8 text-center">
          <p className="text-3xl">📭</p>

          <p className="mt-2 font-medium text-gray-700">
            Todavía no hay entregas.
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Las entregas de los estudiantes aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {entregas.map((entrega) => {
            const estudiante = entrega.matricula?.estudiante?.usuario;

            return (
              <article
                key={entrega.id_entrega}
                className="rounded-lg border border-gray-200 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {estudiante
                        ? `${estudiante.primer_nombre} ${estudiante.primer_apellido}`
                        : "Estudiante"}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {estudiante?.email ?? "Correo no disponible"}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Entregada:{" "}
                      {new Date(entrega.fecha_entrega).toLocaleString("es-UY")}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      entrega.estado === "CALIFICADA"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {entrega.estado}
                  </span>
                </div>

                {entrega.respuesta_texto && (
                  <div className="mt-4 rounded-lg bg-gray-50 p-3">
                    <p className="mb-1 text-xs font-semibold text-gray-500">
                      Respuesta del estudiante
                    </p>

                    <p className="whitespace-pre-wrap text-sm text-gray-700">
                      {entrega.respuesta_texto}
                    </p>
                  </div>
                )}

                {entrega.archivo_url && (
                  <div className="mt-3">
                    <a
                      href={entrega.archivo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-indigo-600 hover:underline"
                    >
                      Ver archivo o recurso entregado
                    </a>
                  </div>
                )}

                {entrega.estado === "CALIFICADA" && (
                  <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm">
                    <p className="font-semibold text-green-800">
                      Puntaje: {entrega.puntaje_obtenido} /{" "}
                      {actividad.puntaje_maximo}
                    </p>

                    {entrega.observacion_docente && (
                      <p className="mt-1 text-green-700">
                        Observación: {entrega.observacion_docente}
                      </p>
                    )}
                  </div>
                )}

                {entrega.estado === "ENTREGADA" && (
                  <div className="mt-4">
                    {entregaSeleccionada === entrega.id_entrega ? (
                      <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Puntaje obtenido
                          </label>

                          <input
                            type="number"
                            min="0"
                            max={Number(actividad.puntaje_maximo)}
                            step="0.01"
                            value={puntaje}
                            onChange={(e) => setPuntaje(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500"
                          />

                          <p className="mt-1 text-xs text-gray-500">
                            Máximo: {actividad.puntaje_maximo} puntos.
                          </p>
                        </div>

                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Observación del docente
                          </label>

                          <textarea
                            value={observacion}
                            onChange={(e) => setObservacion(e.target.value)}
                            rows={3}
                            placeholder="Escribe una observación (opcional)"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={guardando}
                            onClick={() =>
                              void guardarCalificacion(entrega.id_entrega)
                            }
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                          >
                            {guardando
                              ? "Guardando..."
                              : "Guardar calificación"}
                          </button>

                          <button
                            type="button"
                            disabled={guardando}
                            onClick={() => setEntregaSeleccionada(null)}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-white disabled:opacity-50"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => abrirCalificacion(entrega)}
                        disabled={guardando}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                      >
                        Calificar entrega
                      </button>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
/**Qué hace este componente
- Consulta las entregas de una actividad.
- Muestra el nombre y correo del estudiante.
- Permite leer respuestas escritas y abrir recursos externos.
- Permite asignar un puntaje y una observación.
- Diferencia entregas pendientes de las calificadas.
- Actualiza el listado después de calificar. 
*/