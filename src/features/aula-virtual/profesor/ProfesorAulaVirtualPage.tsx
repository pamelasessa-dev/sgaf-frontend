import { useEffect, useState } from "react";

import { obtenerGrupos } from "../../../services/grupoService";

import {
  obtenerActividadesPorGrupo,
  crearActividad,
  actualizarActividad,
  cambiarEstadoActividad,
} from "../../../services/actividadService";

import { useAuthStore } from "../../../stores/authStore";

import ActividadFormulario from "../components/ActividadFormulario";
import SelectorGrupo from "../components/SelectorGrupo";
import ListaActividades from "../components/ListaActividades";

import type { Grupo } from "../../../types/grupo";

import type {
  ActividadAcademica,
  CrearActividadDto,
} from "../../../types/aulaVirtual";
import EntregasActividad from "../components/EntregasActividad";

export default function ProfesorAulaVirtualPage() {
  const usuario = useAuthStore((state) => state.usuario);

  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<number | null>(
    null,
  );

  const [actividades, setActividades] = useState<ActividadAcademica[]>([]);

  const [cargandoGrupos, setCargandoGrupos] = useState(true);
  const [cargandoActividades, setCargandoActividades] = useState(false);

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [actividadEnEdicion, setActividadEnEdicion] = useState<
    ActividadAcademica | undefined
  >(undefined);

  const [actividadProcesando, setActividadProcesando] = useState<number | null>(
    null,
  );
  const [actividadEntregas, setActividadEntregas] =
    useState<ActividadAcademica | null>(null);

  // Cargar los grupos asignados al profesor autenticado.
  useEffect(() => {
    const cargarGrupos = async () => {
      try {
        setCargandoGrupos(true);
        setError("");

        const respuesta = await obtenerGrupos();

        const gruposProfesor = respuesta.filter(
          (grupo) =>
            grupo.profesor?.usuario?.id_usuario === usuario?.id_usuario,
        );

        setGrupos(gruposProfesor);

        if (gruposProfesor.length > 0) {
          setGrupoSeleccionado(gruposProfesor[0].id_grupo);
        }
      } catch {
        setError("No fue posible cargar tus grupos académicos.");
      } finally {
        setCargandoGrupos(false);
      }
    };

    if (usuario?.id_usuario) {
      void cargarGrupos();
    }
  }, [usuario?.id_usuario]);

  // Cargar actividades del grupo seleccionado.
  useEffect(() => {
    const cargarActividades = async () => {
      if (grupoSeleccionado === null) {
        setActividades([]);
        return;
      }

      try {
        setCargandoActividades(true);
        setError("");

        const respuesta = await obtenerActividadesPorGrupo(grupoSeleccionado);

        setActividades(respuesta);
      } catch {
        setActividades([]);
        setError("No fue posible cargar las actividades del grupo.");
      } finally {
        setCargandoActividades(false);
      }
    };

    void cargarActividades();
  }, [grupoSeleccionado]);

  // Obtener el grupo seleccionado.
  const grupoActual = grupos.find(
    (grupo) => grupo.id_grupo === grupoSeleccionado,
  );

  // Seleccionar otro grupo.
  const seleccionarGrupo = (idGrupo: number) => {
    setGrupoSeleccionado(idGrupo);
    setMostrarFormulario(false);
    setActividadEnEdicion(undefined);
    setMensaje("");
    setError("");
  };

  // Abrir formulario para crear una actividad.
  const abrirFormularioCrear = () => {
    setActividadEnEdicion(undefined);
    setMensaje("");
    setError("");
    setMostrarFormulario(true);
  };

  // Abrir formulario para editar una actividad.
  const abrirFormularioEditar = (actividad: ActividadAcademica) => {
    setActividadEnEdicion(actividad);
    setMensaje("");
    setError("");
    setMostrarFormulario(true);
  };

  // Cerrar formulario.
  const cancelarFormulario = () => {
    setMostrarFormulario(false);
    setActividadEnEdicion(undefined);
  };

  // Crear o actualizar una actividad.
  const guardarActividad = async (datos: CrearActividadDto) => {
    try {
      setError("");
      setMensaje("");

      if (actividadEnEdicion) {
        await actualizarActividad(actividadEnEdicion.id_actividad, {
          titulo: datos.titulo,
          descripcion: datos.descripcion,
          tipo: datos.tipo,
          puntaje_maximo: datos.puntaje_maximo,
          porcentaje_aporte: datos.porcentaje_aporte,
          fecha_apertura: datos.fecha_apertura,
          fecha_cierre: datos.fecha_cierre,
        });

        setMensaje("La actividad se actualizó correctamente.");
      } else {
        await crearActividad(datos);

        setMensaje("La actividad se creó correctamente.");
      }

      setMostrarFormulario(false);
      setActividadEnEdicion(undefined);

      if (grupoSeleccionado !== null) {
        const respuesta = await obtenerActividadesPorGrupo(grupoSeleccionado);

        setActividades(respuesta);
      }
    } catch {
      setError(
        actividadEnEdicion
          ? "No fue posible actualizar la actividad. Verifica los datos y las restricciones del grupo."
          : "No fue posible crear la actividad. Verifica que el grupo esté abierto y que las fechas pertenezcan al período académico.",
      );
    }
  };

  // Publicar o cerrar una actividad.
  const gestionarEstadoActividad = async (
    actividad: ActividadAcademica,
    nuevoEstado: "ABIERTA" | "CERRADA",
  ) => {
    // Evitar operaciones simultáneas.
    if (actividadProcesando !== null) return;

    // Comprobar que la transición corresponda al estado actual.
    if (
      (nuevoEstado === "ABIERTA" && actividad.estado !== "BORRADOR") ||
      (nuevoEstado === "CERRADA" && actividad.estado !== "ABIERTA")
    ) {
      return;
    }

    const accion = nuevoEstado === "ABIERTA" ? "publicar" : "cerrar";

    const confirmado = window.confirm(
      `¿Estás seguro de que deseas ${accion} la actividad "${actividad.titulo}"?`,
    );

    if (!confirmado) return;

    try {
      setError("");
      setMensaje("");
      setActividadProcesando(actividad.id_actividad);

      await cambiarEstadoActividad(actividad.id_actividad, {
        estado: nuevoEstado,
      });

      const respuesta = await obtenerActividadesPorGrupo(actividad.id_grupo);

      setActividades(respuesta);

      setMensaje(
        nuevoEstado === "ABIERTA"
          ? "La actividad se publicó correctamente."
          : "La actividad se cerró correctamente.",
      );
    } catch {
      setError(
        nuevoEstado === "ABIERTA"
          ? "No fue posible publicar la actividad. Verifica que todavía sea un borrador y que seas el profesor responsable."
          : "No fue posible cerrar la actividad. Verifica que esté abierta y que seas el profesor responsable.",
      );
    } finally {
      setActividadProcesando(null);
    }
  };

  if (cargandoGrupos) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        Cargando tus grupos...
      </div>
    );
  }
  // Abrir el panel de entregas de una actividad.
  const abrirEntregas = (actividad: ActividadAcademica) => {
    setActividadEntregas(actividad);
    setMensaje("");
    setError("");
  };

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-indigo-100 p-3 text-indigo-700">
          <span className="text-2xl">🎓</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Aula Virtual</h1>

          <p className="text-sm text-gray-500">
            Gestiona las actividades académicas de tus grupos.
          </p>
        </div>
      </div>

      {/* Mensajes */}
      {mensaje && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {mensaje}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Resumen */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Mis grupos</p>

          <p className="mt-2 text-3xl font-bold text-indigo-700">
            {grupos.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Actividades del grupo</p>

          <p className="mt-2 text-3xl font-bold text-indigo-700">
            {actividades.length}
          </p>
        </div>
      </div>

      {/* Selector de grupo */}
      <section>
        <div className="mb-3">
          <h2 className="font-semibold text-gray-900">Mis grupos académicos</h2>
        </div>

        <SelectorGrupo
          grupos={grupos}
          grupoSeleccionado={grupoSeleccionado}
          onSeleccionar={seleccionarGrupo}
        />
      </section>

      {/* Actividades del grupo seleccionado */}
      {grupoActual && (
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Actividades académicas
              </h2>

              <p className="text-sm text-gray-500">
                {grupoActual.nombre} · {grupoActual.materia?.nombre}
              </p>
            </div>

            <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
              {actividades.length} actividades
            </span>
          </div>

          {/* Botón para crear actividad */}
          {!mostrarFormulario && grupoActual.estado === "ABIERTO" && (
            <div className="mb-5">
              <button
                type="button"
                onClick={abrirFormularioCrear}
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                + Nueva actividad
              </button>
            </div>
          )}

          {/* Formulario de creación o edición */}
          {mostrarFormulario && (
            <div className="mb-6">
              <ActividadFormulario
                idGrupo={grupoActual.id_grupo}
                actividad={actividadEnEdicion}
                onGuardar={guardarActividad}
                onCancelar={cancelarFormulario}
              />
            </div>
          )}

          {/* Listado de actividades */}
          <ListaActividades
            actividades={actividades}
            cargando={cargandoActividades}
            actividadProcesando={actividadProcesando}
            onEditar={abrirFormularioEditar}
            onVerEntregas={abrirEntregas}
            onCambiarEstado={gestionarEstadoActividad}
          />
        </section>
      )}
      {actividadEntregas && (
        <div className="mt-6">
          <EntregasActividad
            actividad={actividadEntregas}
            onCerrar={() => setActividadEntregas(null)}
          />
        </div>
      )}

      {/* Cuando el profesor no tiene grupos */}
      {grupos.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <div className="mb-3 text-3xl">📚</div>

          <h2 className="font-semibold text-gray-700">
            No tienes grupos asignados
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Cuando tengas grupos académicos asignados, aparecerán aquí.
          </p>
        </div>
      )}
    </div>
  );
}

/**Resultado esperado
- ProfesorAulaVirtualPage coordina la pantalla.
- SelectorGrupo permite cambiar de grupo.
- ListaActividades muestra las actividades.
- ActividadCard administra la presentación y los botones.
- Publicar y cerrar siguen conectados al backend. */
