/**
 * PeriodoFormulario.tsx
 * Formulario para registrar nuevos períodos académicos.
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { crearPeriodo } from "../../../services/periodoService";
import {
  periodoSchema,
  type PeriodoFormulario as DatosPeriodo,
} from "./periodoSchema";

interface PeriodoFormularioProps {
  onPeriodoCreado: () => void | Promise<void>;
}

// Obtiene un mensaje legible de los errores HTTP del backend.
function obtenerMensajeError(error: unknown): string {
  const respuesta = error as {
    response?: { data?: { message?: string | string[] } };
  };

  const mensaje = respuesta.response?.data?.message;

  if (Array.isArray(mensaje)) return mensaje.join(". ");
  if (typeof mensaje === "string") return mensaje;

  return "No se pudo registrar el período. Verifica los datos e intenta nuevamente.";
}

export default function PeriodoFormulario({
  onPeriodoCreado,
}: PeriodoFormularioProps) {
  const [errorServidor, setErrorServidor] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof periodoSchema>, unknown, DatosPeriodo>({
    resolver: zodResolver(periodoSchema),
    defaultValues: {
      nombre: "",
      fecha_inicio: "",
      fecha_fin: "",
      limite_creditos: 24,
      estado: "PLANIFICADO",
    },
  });

  const onSubmit = async (datos: DatosPeriodo) => {
    try {
      setErrorServidor("");

      await crearPeriodo(datos);
      reset();

      await onPeriodoCreado();
    } catch (error) {
      console.error("Error al registrar el período:", error);
      setErrorServidor(obtenerMensajeError(error));
    }
  };

  const claseCampo =
    "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  const claseEtiqueta = "text-sm font-medium text-slate-700";

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
          Registrar período académico
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Completa la información del nuevo ciclo académico.
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
          <label htmlFor="periodo-nombre" className={claseEtiqueta}>
            Nombre del período
          </label>
          <input
            id="periodo-nombre"
            type="text"
            placeholder="Ej. Primer semestre 2027"
            {...register("nombre")}
            className={claseCampo}
          />
          {errors.nombre && (
            <p className="mt-1 text-xs text-red-600">{errors.nombre.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="periodo-fecha-inicio" className={claseEtiqueta}>
            Fecha de inicio
          </label>
          <input
            id="periodo-fecha-inicio"
            type="date"
            {...register("fecha_inicio")}
            className={claseCampo}
          />
          {errors.fecha_inicio && (
            <p className="mt-1 text-xs text-red-600">
              {errors.fecha_inicio.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="periodo-fecha-fin" className={claseEtiqueta}>
            Fecha de finalización
          </label>
          <input
            id="periodo-fecha-fin"
            type="date"
            {...register("fecha_fin")}
            className={claseCampo}
          />
          {errors.fecha_fin && (
            <p className="mt-1 text-xs text-red-600">
              {errors.fecha_fin.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="periodo-creditos" className={claseEtiqueta}>
            Límite de créditos
          </label>
          <input
            id="periodo-creditos"
            type="number"
            min="1"
            step="1"
            {...register("limite_creditos")}
            className={claseCampo}
          />
          {errors.limite_creditos && (
            <p className="mt-1 text-xs text-red-600">
              {errors.limite_creditos.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="periodo-estado" className={claseEtiqueta}>
            Estado inicial
          </label>
          <select
            id="periodo-estado"
            {...register("estado")}
            className={claseCampo}
          >
            <option value="PLANIFICADO">Planificado</option>
            <option value="ACTIVO">Activo</option>
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
            reset();
            setErrorServidor("");
          }}
          disabled={isSubmitting}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Limpiar
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Registrando..." : "Registrar período"}
        </button>
      </div>
    </form>
  );
}
