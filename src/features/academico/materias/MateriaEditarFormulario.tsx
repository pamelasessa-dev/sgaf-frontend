/**
 * MateriaEditarFormulario.tsx
 *
 * Formulario para modificar una materia existente.
 *
 * Carga los datos actuales de la materia y permite
 * actualizar sus propiedades mediante PATCH.
 */

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { actualizarMateria } from "../../../services/materiaService";
import type { Materia } from "../../../types/materia";

import {
  materiaEditarSchema,
  type MateriaEditarFormulario as DatosMateria,
} from "./materiaSchema";

// Propiedades que recibe el formulario desde la página.
interface MateriaEditarFormularioProps {
  materia: Materia;
  onMateriaActualizada: () => void | Promise<void>;
  onCancelar: () => void;
}

// Obtiene un mensaje útil de los errores HTTP del backend.
function obtenerMensajeError(error: unknown): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const respuesta = error.response;

    if (
      typeof respuesta === "object" &&
      respuesta !== null &&
      "data" in respuesta
    ) {
      const datos = respuesta.data;

      if (typeof datos === "object" && datos !== null && "message" in datos) {
        const mensaje = datos.message;

        if (typeof mensaje === "string") {
          return mensaje;
        }

        if (
          Array.isArray(mensaje) &&
          mensaje.every((item) => typeof item === "string")
        ) {
          return mensaje.join(". ");
        }
      }
    }
  }

  return "No se pudo actualizar la materia. Verifica los datos e intenta nuevamente.";
}

export default function MateriaEditarFormulario({
  materia,
  onMateriaActualizada,
  onCancelar,
}: MateriaEditarFormularioProps) {
  // Mensaje de error devuelto por el backend.
  const [errorServidor, setErrorServidor] = useState("");

  // Configuramos React Hook Form y sus validaciones.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof materiaEditarSchema>, unknown, DatosMateria>({
    resolver: zodResolver(materiaEditarSchema),

    defaultValues: {
      nombre: materia.nombre,
      descripcion: materia.descripcion,
      creditos: materia.creditos,
      costos_inscripcion: Number(materia.costos_inscripcion),
      costo_mensual: Number(materia.costo_mensual),
      estado: materia.estado,
    },
  });

  // Actualizamos los campos si cambia la materia seleccionada.
  useEffect(() => {
    reset({
      nombre: materia.nombre,
      descripcion: materia.descripcion,
      creditos: materia.creditos,
      costos_inscripcion: Number(materia.costos_inscripcion),
      costo_mensual: Number(materia.costo_mensual),
      estado: materia.estado,
    });

    setErrorServidor("");
  }, [materia, reset]);

  // Estilos reutilizados para los campos.
  const claseCampo =
    "w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100";

  const claseEtiqueta = "mb-1.5 block text-sm font-semibold text-slate-700";

  const claseError = "mt-1.5 text-xs font-medium text-red-600";

  // Envía los cambios al backend.
  const onSubmit = async (datos: DatosMateria) => {
    try {
      setErrorServidor("");

      // PATCH /materias/:id
      await actualizarMateria(materia.id_materia, datos);

      // Actualizamos la tabla en el componente padre.
      await onMateriaActualizada();
    } catch (error) {
      console.error("Error al actualizar la materia:", error);
      setErrorServidor(obtenerMensajeError(error));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Error devuelto por el backend */}
      {errorServidor && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <p className="font-semibold">No se pudo actualizar la materia</p>
          <p className="mt-1">{errorServidor}</p>
        </div>
      )}

      {/* Nombre y descripción */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="editar-nombre" className={claseEtiqueta}>
            Nombre de la materia *
          </label>

          <input
            id="editar-nombre"
            type="text"
            maxLength={150}
            disabled={isSubmitting}
            {...register("nombre")}
            className={claseCampo}
          />

          {errors.nombre && (
            <p className={claseError}>{errors.nombre.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="editar-descripcion" className={claseEtiqueta}>
            Descripción *
          </label>

          <input
            id="editar-descripcion"
            type="text"
            disabled={isSubmitting}
            {...register("descripcion")}
            className={claseCampo}
          />

          {errors.descripcion && (
            <p className={claseError}>{errors.descripcion.message}</p>
          )}
        </div>
      </div>

      {/* Créditos y costos */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label htmlFor="editar-creditos" className={claseEtiqueta}>
            Créditos *
          </label>

          <input
            id="editar-creditos"
            type="number"
            min="1"
            step="1"
            disabled={isSubmitting}
            {...register("creditos")}
            className={claseCampo}
          />

          {errors.creditos && (
            <p className={claseError}>{errors.creditos.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="editar-costos-inscripcion" className={claseEtiqueta}>
            Costo de inscripción (USD) *
          </label>

          <input
            id="editar-costos-inscripcion"
            type="number"
            min="0"
            step="0.01"
            disabled={isSubmitting}
            {...register("costos_inscripcion")}
            className={claseCampo}
          />

          {errors.costos_inscripcion && (
            <p className={claseError}>{errors.costos_inscripcion.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="editar-costo-mensual" className={claseEtiqueta}>
            Costo mensual (USD) *
          </label>

          <input
            id="editar-costo-mensual"
            type="number"
            min="0"
            step="0.01"
            disabled={isSubmitting}
            {...register("costo_mensual")}
            className={claseCampo}
          />

          {errors.costo_mensual && (
            <p className={claseError}>{errors.costo_mensual.message}</p>
          )}
        </div>
      </div>

      {/* Estado */}
      <div className="max-w-sm">
        <label htmlFor="editar-estado" className={claseEtiqueta}>
          Estado *
        </label>

        <select
          id="editar-estado"
          disabled={isSubmitting}
          {...register("estado")}
          className={claseCampo}
        >
          <option value="ACTIVA">Activa</option>
          <option value="INACTIVA">Inactiva</option>
        </select>

        {errors.estado && <p className={claseError}>{errors.estado.message}</p>}
      </div>

      {/* Acciones */}
      <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
        <button
          type="button"
          onClick={onCancelar}
          disabled={isSubmitting}
          className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
