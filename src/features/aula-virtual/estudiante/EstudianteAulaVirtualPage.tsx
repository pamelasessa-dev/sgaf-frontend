import { useEffect, useState } from "react";

import { obtenerMisMatriculas } from "../../../services/matriculaService";
import { obtenerActividadesPorGrupo } from "../../../services/actividadService";
import { obtenerMisEntregas } from "../../../services/entregaService";

import type { Matricula } from "../../../types/matricula";
import type {
  ActividadAcademica,
  EntregaAcademica,
} from "../../../types/aulaVirtual";

import EntregaEstudiante from "./EntregaEstudiante";

export default function EstudianteAulaVirtualPage() {
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<number | null>(
    null,
  );
  const [actividades, setActividades] = useState<ActividadAcademica[]>([]);
  const [entregas, setEntregas] = useState<EntregaAcademica[]>([]);

  const [cargandoMatriculas, setCargandoMatriculas] = useState(true);
  const [cargandoActividades, setCargandoActividades] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarMatriculas = async () => {
      try {
        setCargandoMatriculas(true);
        setError("");

        const respuesta = await obtenerMisMatriculas();
        setMatriculas(respuesta);

        const activas = respuesta.filter(
          (matricula) => matricula.estado === "ACTIVA",
        );

        if (activas.length > 0) {
          setGrupoSeleccionado(activas[0].id_grupo);
        }
      } catch {
        setError("No fue posible cargar tus matrículas académicas.");
      } finally {
        setCargandoMatriculas(false);
      }
    };

    void cargarMatriculas();
  }, []);

  useEffect(() => {
    const cargarActividadesYEntregas = async () => {
      if (grupoSeleccionado === null) {
        setActividades([]);
        return;
      }

      try {
        setCargandoActividades(true);
        setError("");

        const [respuestaActividades, respuestaEntregas] = await Promise.all([
          obtenerActividadesPorGrupo(grupoSeleccionado),
          obtenerMisEntregas(),
        ]);

        setActividades(respuestaActividades);
        setEntregas(respuestaEntregas);
      } catch {
        setActividades([]);
        setError("No fue posible cargar las actividades o tus entregas.");
      } finally {
        setCargandoActividades(false);
      }
    };

    void cargarActividadesYEntregas();
  }, [grupoSeleccionado]);

  const matriculasActivas = matriculas.filter(
    (matricula) => matricula.estado === "ACTIVA",
  );

  const matriculaActual = matriculasActivas.find(
    (matricula) => matricula.id_grupo === grupoSeleccionado,
  );

  const seleccionarGrupo = (idGrupo: number) => {
    setGrupoSeleccionado(idGrupo);
    setError("");
  };

  const registrarEntrega = (nuevaEntrega: EntregaAcademica) => {
    setEntregas((actuales) => [
      nuevaEntrega,
      ...actuales.filter(
        (entrega) => entrega.id_actividad !== nuevaEntrega.id_actividad,
      ),
    ]);
  };

  if (cargandoMatriculas) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        Cargando tus grupos académicos...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-indigo-100 p-3 text-indigo-700">
          <span className="text-2xl">🎓</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Aula Virtual</h1>
          <p className="text-sm text-gray-500">
            Consulta y entrega las actividades de tus grupos académicos.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Grupos activos</p>
          <p className="mt-2 text-3xl font-bold text-indigo-700">
            {matriculasActivas.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Actividades del grupo</p>
          <p className="mt-2 text-3xl font-bold text-indigo-700">
            {actividades.length}
          </p>
        </div>
      </div>

      <section>
        <h2 className="mb-4 font-semibold text-gray-900">
          Mis grupos académicos
        </h2>

        {matriculasActivas.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
            <div className="mb-3 text-3xl">📚</div>
            <h3 className="font-semibold text-gray-700">
              No tienes grupos activos
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Necesitas una matrícula activa para acceder a las actividades
              académicas.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {matriculasActivas.map((matricula) => (
              <button
                key={matricula.id_matricula}
                type="button"
                onClick={() => seleccionarGrupo(matricula.id_grupo)}
                className={`rounded-xl border p-5 text-left shadow-sm transition ${
                  grupoSeleccionado === matricula.id_grupo
                    ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100"
                    : "border-gray-200 bg-white hover:border-indigo-300"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                  {matricula.grupo.materia.nombre}
                </p>

                <h3 className="mt-2 font-semibold text-gray-900">
                  {matricula.grupo.nombre}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Profesor: {matricula.grupo.profesor.usuario.primer_nombre}{" "}
                  {matricula.grupo.profesor.usuario.primer_apellido}
                </p>

                <span className="mt-4 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  Matrícula activa
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      {matriculaActual && (
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Actividades académicas
            </h2>
            <p className="text-sm text-gray-500">
              {matriculaActual.grupo.nombre} ·{" "}
              {matriculaActual.grupo.materia.nombre}
            </p>
          </div>

          {cargandoActividades ? (
            <p className="py-8 text-center text-sm text-gray-500">
              Cargando actividades...
            </p>
          ) : actividades.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
              <p className="font-medium text-gray-600">
                No hay actividades disponibles.
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Cuando tu profesor publique actividades, aparecerán aquí.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {actividades.map((actividad) => {
                const entrega = entregas.find(
                  (item) => item.id_actividad === actividad.id_actividad,
                );

                return (
                  <article
                    key={actividad.id_actividad}
                    className="rounded-lg border border-gray-200 p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {actividad.titulo}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {actividad.descripcion || "Sin descripción"}
                        </p>
                      </div>

                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                        {actividad.estado}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                      <div>
                        <p className="text-gray-500">Tipo</p>
                        <p className="font-medium text-gray-700">
                          {actividad.tipo}
                        </p>
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
                    </div>

                    <EntregaEstudiante
                      actividad={actividad}
                      entrega={entrega}
                      onEntregaCreada={registrarEntrega}
                    />
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {matriculas.some((matricula) => matricula.estado === "PENDIENTE") && (
        <section className="rounded-xl border border-yellow-200 bg-yellow-50 p-5">
          <h2 className="font-semibold text-yellow-800">
            Matrículas pendientes
          </h2>
          <p className="mt-1 text-sm text-yellow-700">
            Estos grupos todavía no están habilitados para acceder al Aula
            Virtual:
          </p>
          <ul className="mt-3 list-inside list-disc text-sm text-yellow-800">
            {matriculas
              .filter((matricula) => matricula.estado === "PENDIENTE")
              .map((matricula) => (
                <li key={matricula.id_matricula}>
                  {matricula.grupo.nombre} · {matricula.grupo.materia.nombre}
                </li>
              ))}
          </ul>
        </section>
      )}
    </div>
  );
}
