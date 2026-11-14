/**
 * GrupoEditarFormulario.tsx
 *
 * Formulario para editar un grupo académico existente.
 *
 * El backend actualmente permite modificar:
 * nombre, cupo_maximo y estado.
 */

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { actualizarGrupo } from "../../../services/grupoService";
import type { Grupo } from "../../../types/grupo";

import {
  grupoEditarSchema,
  type GrupoEditarFormulario as DatosGrupo,
} from "./grupoSchema";

interface GrupoEditarFormularioProps {
  grupo: Grupo;
  onGrupoActualizado: () => void | Promise<void>;
  onCancelar: () => void;
}

// Obtiene un mensaje legible de los errores HTTP del backend.
function obtenerMensajeError(error: unknown): string {
  const respuesta = error as {
    response?: { data?: { message?: string | string[] } };
  };

  const mensaje = respuesta.response?.data?.message;

  if (Array.isArray(mensaje)) return mensaje.join(". ");
  if (typeof mensaje === "string") return mensaje;

  return "No se pudo actualizar el grupo académico. Verifica los datos e intenta nuevamente.";
}

export default function GrupoEditarFormulario({
  grupo,
  onGrupoActualizado,
  onCancelar,
}: GrupoEditarFormularioProps) {
  const [errorServidor, setErrorServidor] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof grupoEditarSchema>, unknown, DatosGrupo>({
    resolver: zodResolver(grupoEditarSchema),
    defaultValues: {
      nombre: grupo.nombre,
      cupo_maximo: grupo.cupo_maximo,
      estado: grupo.estado,
    },
  });

  // Actualiza los campos cuando cambia el grupo seleccionado.
  useEffect(() => {
    reset({
      nombre: grupo.nombre,
      cupo_maximo: grupo.cupo_maximo,
      estado: grupo.estado,
    });

    setErrorServidor("");
  }, [grupo, reset]);

  const onSubmit = async (datos: DatosGrupo) => {
    try {
      setErrorServidor("");

      await actualizarGrupo(grupo.id_grupo, datos);

      await onGrupoActualizado();
    } catch (error) {
      console.error("Error al actualizar el grupo:", error);
      setErrorServidor(obtenerMensajeError(error));
    }
  };

  const claseCampo =
    "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  const claseEtiqueta = "text-sm font-medium text-slate-700";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="border-b border-slate-100 pb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
          Modificación de registro · #{grupo.id_grupo}
        </p>

        <h2 className="mt-1 text-lg font-bold text-slate-900">
          Editar grupo académico
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Modifica el nombre, el cupo máximo y el estado del grupo.
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

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="editar-grupo-nombre" className={claseEtiqueta}>
            Nombre del grupo
          </label>

          <input
            id="editar-grupo-nombre"
            type="text"
            {...register("nombre")}
            className={claseCampo}
          />

          {errors.nombre && (
            <p className="mt-1 text-xs text-red-600">{errors.nombre.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="editar-grupo-cupo" className={claseEtiqueta}>
            Cupo máximo
          </label>

          <input
            id="editar-grupo-cupo"
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
          <label htmlFor="editar-grupo-estado" className={claseEtiqueta}>
            Estado
          </label>

          <select
            id="editar-grupo-estado"
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

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-xs font-semibold text-slate-700">
          Relaciones del grupo
        </p>

        <p className="mt-1 text-sm text-slate-600">
          Materia: {grupo.materia?.nombre ?? `ID ${grupo.id_materia}`}
        </p>

        <p className="text-sm text-slate-600">
          Período: {grupo.periodo?.nombre ?? `ID ${grupo.id_periodo}`}
        </p>

        <p className="text-sm text-slate-600">
          Profesor:{" "}
          {grupo.profesor
            ? [
                grupo.profesor.usuario.primer_nombre,
                grupo.profesor.usuario.primer_apellido,
              ]
                .filter(Boolean)
                .join(" ")
            : `ID ${grupo.id_profesor}`}
        </p>

        <p className="text-sm text-slate-600">
          Aula: {grupo.aula?.nombre ?? `ID ${grupo.id_aula}`}
        </p>

        <p className="mt-2 text-xs text-slate-500">
          Las relaciones se muestran como información y no se pueden modificar
          desde este formulario debido a las limitaciones actuales del backend.
        </p>
      </div>

      <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onCancelar}
          disabled={isSubmitting}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
