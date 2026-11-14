/**
 * MateriaFormulario.tsx
 *
 * Formulario para registrar nuevas materias.
 *
 * Utiliza React Hook Form y Zod para validar los datos
 * antes de enviarlos al backend.
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { crearMateria } from "../../../services/materiaService";
import {
  materiaSchema,
  type MateriaFormulario as DatosMateria,
} from "./materiaSchema";

// Define la función que ejecutará el componente padre
// después de registrar correctamente una materia.
interface MateriaFormularioProps {
  onMateriaCreada: () => void | Promise<void>;
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

  return "No se pudo registrar la materia. Verifica los datos e intenta nuevamente.";
}

export default function MateriaFormulario({
  onMateriaCreada,
}: MateriaFormularioProps) {
  // Mensaje de error devuelto por el backend.
  const [errorServidor, setErrorServidor] = useState("");

  // Configura React Hook Form y conecta las validaciones de Zod.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof materiaSchema>, unknown, DatosMateria>({
    resolver: zodResolver(materiaSchema),

    // Valores iniciales del formulario.
    defaultValues: {
      nombre: "",
      descripcion: "",
      creditos: 1,
      costos_inscripcion: 0,
      costo_mensual: 0,
      estado: "ACTIVA",
    },
  });

  // Estilos reutilizados para los campos.
  const claseCampo =
    "w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100";

  const claseEtiqueta = "mb-1.5 block text-sm font-semibold text-slate-700";

  const claseError = "mt-1.5 text-xs font-medium text-red-600";

  // Se ejecuta cuando el formulario supera las validaciones.
  const onSubmit = async (datos: DatosMateria) => {
    try {
      setErrorServidor("");

      // Envía los datos al backend mediante el servicio.
      await crearMateria(datos);

      // Limpia el formulario después del registro.
      reset();

      // Notifica al componente padre para actualizar la lista.
      await onMateriaCreada();
    } catch (error) {
      console.error("Error al registrar la materia:", error);
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
          <p className="font-semibold">No se pudo registrar la materia</p>
          <p className="mt-1">{errorServidor}</p>
        </div>
      )}

      {/* Nombre y descripción */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="nombre" className={claseEtiqueta}>
            Nombre de la materia *
          </label>

          <input
            id="nombre"
            type="text"
            maxLength={150}
            placeholder="Ej. Programación I"
            disabled={isSubmitting}
            {...register("nombre")}
            className={claseCampo}
          />

          {errors.nombre && (
            <p className={claseError}>{errors.nombre.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="descripcion" className={claseEtiqueta}>
            Descripción *
          </label>

          <input
            id="descripcion"
            type="text"
            placeholder="Descripción de la materia"
            disabled={isSubmitting}
            {...register("descripcion")}
            className={claseCampo}
          />

          {errors.descripcion && (
            <p className={claseError}>{errors.descripcion.message}</p>
          )}
        </div>
      </div>

      {/* Información académica y financiera */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label htmlFor="creditos" className={claseEtiqueta}>
            Créditos *
          </label>

          <input
            id="creditos"
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
          <label htmlFor="costos_inscripcion" className={claseEtiqueta}>
            Costo de inscripción (USD) *
          </label>

          <input
            id="costos_inscripcion"
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
          <label htmlFor="costo_mensual" className={claseEtiqueta}>
            Costo mensual (USD) *
          </label>

          <input
            id="costo_mensual"
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

      {/* Estado inicial */}
      <div className="max-w-sm">
        <label htmlFor="estado" className={claseEtiqueta}>
          Estado inicial *
        </label>

        <select
          id="estado"
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
          disabled={isSubmitting}
          onClick={() => reset()}
          className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Limpiar
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Registrando..." : "Registrar materia"}
        </button>
      </div>
    </form>
  );
}