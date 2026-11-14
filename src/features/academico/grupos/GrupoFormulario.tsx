/**
 * GrupoFormulario.tsx
 *
 * Formulario para registrar nuevos grupos académicos.
 * Permite relacionar materias, períodos, profesores y aulas.
 */

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { crearGrupo } from "../../../services/grupoService";
import { obtenerMaterias } from "../../../services/materiaService";
import { obtenerPeriodos } from "../../../services/periodoService";
import { obtenerProfesores } from "../../../services/profesorService";
import { obtenerAulas } from "../../../services/aulaService";

import type { Materia } from "../../../types/materia";
import type { Periodo } from "../../../types/periodo";
import type { Profesor } from "../../../types/profesor";
import type { Aula } from "../../../types/aula";

import { grupoSchema, type GrupoFormulario as DatosGrupo } from "./grupoSchema";

interface GrupoFormularioProps {
  onGrupoCreado: () => void | Promise<void>;
}

// Obtiene un mensaje legible de los errores HTTP del backend.
function obtenerMensajeError(error: unknown): string {
  const respuesta = error as {
    response?: { data?: { message?: string | string[] } };
  };

  const mensaje = respuesta.response?.data?.message;

  if (Array.isArray(mensaje)) return mensaje.join(". ");
  if (typeof mensaje === "string") return mensaje;

  return "No se pudo registrar el grupo. Verifica los datos e intenta nuevamente.";
}

// Construye el nombre completo del profesor.
function obtenerNombreProfesor(profesor: Profesor): string {
  const usuario = profesor.usuario;

  return [
    usuario.primer_nombre,
    usuario.segundo_nombre,
    usuario.primer_apellido,
    usuario.segundo_apellido,
  ]
    .filter(Boolean)
    .join(" ");
}

export default function GrupoFormulario({
  onGrupoCreado,
}: GrupoFormularioProps) {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [aulas, setAulas] = useState<Aula[]>([]);

  const [cargandoCatalogos, setCargandoCatalogos] = useState(true);
  const [errorCatalogos, setErrorCatalogos] = useState("");
  const [errorServidor, setErrorServidor] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof grupoSchema>, unknown, DatosGrupo>({
    resolver: zodResolver(grupoSchema),
    defaultValues: {
      nombre: "",
      id_materia: 0,
      id_periodo: 0,
      id_profesor: 0,
      id_aula: 0,
      cupo_maximo: 1,
      estado: "ABIERTO",
    },
  });

  // Carga las cuatro fuentes necesarias para crear un grupo.
  useEffect(() => {
    let componenteActivo = true;

    async function cargarCatalogos() {
      try {
        setCargandoCatalogos(true);
        setErrorCatalogos("");

        const [
          materiasObtenidas,
          periodosObtenidos,
          profesoresObtenidos,
          aulasObtenidas,
        ] = await Promise.all([
          obtenerMaterias(),
          obtenerPeriodos(),
          obtenerProfesores(),
          obtenerAulas(),
        ]);

        if (!componenteActivo) return;

        setMaterias(materiasObtenidas);
        setPeriodos(periodosObtenidos);
        setProfesores(profesoresObtenidos);
        setAulas(aulasObtenidas);
      } catch (error) {
        console.error("Error al cargar los catálogos del grupo:", error);

        if (componenteActivo) {
          setErrorCatalogos(
            "No se pudieron cargar las materias, períodos, profesores y aulas. Verifica la conexión con el servidor.",
          );
        }
      } finally {
        if (componenteActivo) {
          setCargandoCatalogos(false);
        }
      }
    }

    void cargarCatalogos();

    return () => {
      componenteActivo = false;
    };
  }, []);

  // Solo mostramos opciones válidas para registrar un grupo.
  const materiasDisponibles = materias.filter(
    (materia) => materia.estado === "ACTIVA",
  );

  const periodosDisponibles = periodos.filter(
    (periodo) => periodo.estado === "ACTIVO",
  );

  const profesoresDisponibles = profesores.filter(
    (profesor) => profesor.usuario.estado === "ACTIVO",
  );

  const aulasDisponibles = aulas.filter((aula) => aula.estado === "DISPONIBLE");

  const onSubmit = async (datos: DatosGrupo) => {
    try {
      setErrorServidor("");

      await crearGrupo(datos);

      reset({
        nombre: "",
        id_materia: 0,
        id_periodo: 0,
        id_profesor: 0,
        id_aula: 0,
        cupo_maximo: 1,
        estado: "ABIERTO",
      });

      await onGrupoCreado();
    } catch (error) {
      console.error("Error al registrar el grupo:", error);
      setErrorServidor(obtenerMensajeError(error));
    }
  };

  const claseCampo =
    "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100";

  const claseEtiqueta = "text-sm font-medium text-slate-700";

  if (cargandoCatalogos) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-medium text-slate-600">
          Cargando materias, períodos, profesores y aulas...
        </p>
      </div>
    );
  }

  if (errorCatalogos) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
      >
        <p className="font-semibold">No se pudieron cargar los datos.</p>
        <p className="mt-1">{errorCatalogos}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-3 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700"
        >
          Recargar página
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="border-b border-slate-100 pb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
          Nuevo registro
        </p>
        <h2 className="mt-1 text-lg font-bold text-slate-900">
          Registrar grupo académico
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Selecciona la materia, el período, el profesor y el aula del grupo.
        </p>
      </div>

      {errorServidor && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorServidor}
        </div>
      )}

      {materiasDisponibles.length === 0 ||
      periodosDisponibles.length === 0 ||
      profesoresDisponibles.length === 0 ||
      aulasDisponibles.length === 0 ? (
        <div
          role="alert"
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
        >
          <p className="font-semibold">
            Faltan registros disponibles para crear un grupo.
          </p>
          <p className="mt-1">
            Necesitas al menos una materia activa, un período activo, un
            profesor activo y un aula disponible.
          </p>
          <ul className="mt-2 list-inside list-disc">
            {materiasDisponibles.length === 0 && (
              <li>No hay materias activas.</li>
            )}
            {periodosDisponibles.length === 0 && (
              <li>No hay períodos activos.</li>
            )}
            {profesoresDisponibles.length === 0 && (
              <li>No hay profesores activos.</li>
            )}
            {aulasDisponibles.length === 0 && (
              <li>No hay aulas disponibles.</li>
            )}
          </ul>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="grupo-nombre" className={claseEtiqueta}>
            Nombre del grupo
          </label>
          <input
            id="grupo-nombre"
            type="text"
            placeholder="Ej. Matemática I - Grupo A"
            {...register("nombre")}
            className={claseCampo}
          />
          {errors.nombre && (
            <p className="mt-1 text-xs text-red-600">{errors.nombre.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="grupo-materia" className={claseEtiqueta}>
            Materia
          </label>
          <select
            id="grupo-materia"
            {...register("id_materia")}
            className={claseCampo}
          >
            <option value="0">Selecciona una materia</option>
            {materiasDisponibles.map((materia) => (
              <option key={materia.id_materia} value={materia.id_materia}>
                {materia.nombre} · {materia.creditos} créditos
              </option>
            ))}
          </select>
          {errors.id_materia && (
            <p className="mt-1 text-xs text-red-600">
              {errors.id_materia.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="grupo-periodo" className={claseEtiqueta}>
            Período académico
          </label>
          <select
            id="grupo-periodo"
            {...register("id_periodo")}
            className={claseCampo}
          >
            <option value="0">Selecciona un período</option>
            {periodosDisponibles.map((periodo) => (
              <option key={periodo.id_periodo} value={periodo.id_periodo}>
                {periodo.nombre}
              </option>
            ))}
          </select>
          {errors.id_periodo && (
            <p className="mt-1 text-xs text-red-600">
              {errors.id_periodo.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="grupo-profesor" className={claseEtiqueta}>
            Profesor responsable
          </label>
          <select
            id="grupo-profesor"
            {...register("id_profesor")}
            className={claseCampo}
          >
            <option value="0">Selecciona un profesor</option>
            {profesoresDisponibles.map((profesor) => (
              <option key={profesor.id_profesor} value={profesor.id_profesor}>
                {obtenerNombreProfesor(profesor)}
                {profesor.especialidad ? ` · ${profesor.especialidad}` : ""}
              </option>
            ))}
          </select>
          {errors.id_profesor && (
            <p className="mt-1 text-xs text-red-600">
              {errors.id_profesor.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="grupo-aula" className={claseEtiqueta}>
            Aula asignada
          </label>
          <select
            id="grupo-aula"
            {...register("id_aula")}
            className={claseCampo}
          >
            <option value="0">Selecciona un aula</option>
            {aulasDisponibles.map((aula) => (
              <option key={aula.id_aula} value={aula.id_aula}>
                {aula.nombre} · {aula.tipo} · {aula.capacidad} lugares
              </option>
            ))}
          </select>
          {errors.id_aula && (
            <p className="mt-1 text-xs text-red-600">
              {errors.id_aula.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="grupo-cupo" className={claseEtiqueta}>
            Cupo máximo
          </label>
          <input
            id="grupo-cupo"
            type="number"
            min="1"
            step="1"
            {...register("cupo_maximo")}
            className={claseCampo}
          />
          {errors.cupo_maximo && (
            <p className="mt-1 text-xs text-red-600">
              {errors.cupo_maximo.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="grupo-estado" className={claseEtiqueta}>
            Estado inicial
          </label>
          <select
            id="grupo-estado"
            {...register("estado")}
            className={claseCampo}
          >
            <option value="ABIERTO">Abierto</option>
            <option value="CERRADO">Cerrado</option>
            <option value="FINALIZADO">Finalizado</option>
          </select>
          {errors.estado && (
            <p className="mt-1 text-xs text-red-600">{errors.estado.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => {
            reset({
              nombre: "",
              id_materia: 0,
              id_periodo: 0,
              id_profesor: 0,
              id_aula: 0,
              cupo_maximo: 1,
              estado: "ABIERTO",
            });
            setErrorServidor("");
          }}
          disabled={isSubmitting}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Limpiar
        </button>

        <button
          type="submit"
          disabled={
            isSubmitting ||
            materiasDisponibles.length === 0 ||
            periodosDisponibles.length === 0 ||
            profesoresDisponibles.length === 0 ||
            aulasDisponibles.length === 0
          }
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Registrando..." : "Registrar grupo"}
        </button>
      </div>
    </form>
  );
}
