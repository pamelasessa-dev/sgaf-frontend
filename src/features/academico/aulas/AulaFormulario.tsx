/**
 * AulaFormulario.tsx
 * Formulario para registrar nuevas aulas.
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { crearAula } from "../../../services/aulaService";
import { aulaSchema, type AulaFormulario as DatosAula } from "./aulaSchema";

interface AulaFormularioProps {
  onAulaCreada: () => void | Promise<void>;
}

function obtenerMensajeError(error: unknown): string {
  const respuesta = error as {
    response?: { data?: { message?: string | string[] } };
  };

  const mensaje = respuesta.response?.data?.message;

  if (Array.isArray(mensaje)) return mensaje.join(". ");
  if (typeof mensaje === "string") return mensaje;

  return "No se pudo registrar el aula. Verifica los datos e intenta nuevamente.";
}

export default function AulaFormulario({ onAulaCreada }: AulaFormularioProps) {
  const [errorServidor, setErrorServidor] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof aulaSchema>, unknown, DatosAula>({
    resolver: zodResolver(aulaSchema),
    defaultValues: {
      nombre: "",
      capacidad: 30,
      ubicacion: "",
      tipo: "FISICA",
      estado: "DISPONIBLE",
    },
  });

  const onSubmit = async (datos: DatosAula) => {
    try {
      setErrorServidor("");

      await crearAula(datos);
      reset();

      await onAulaCreada();
    } catch (error) {
      console.error("Error al registrar aula:", error);
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
          Registrar nueva aula
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Completa la información del espacio académico.
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
        <div>
          <label htmlFor="aula-nombre" className={claseEtiqueta}>
            Nombre del aula
          </label>
          <input
            id="aula-nombre"
            type="text"
            placeholder="Ej. Laboratorio 1"
            {...register("nombre")}
            className={claseCampo}
          />
          {errors.nombre && (
            <p className="mt-1 text-xs text-red-600">{errors.nombre.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="aula-capacidad" className={claseEtiqueta}>
            Capacidad de personas
          </label>
          <input
            id="aula-capacidad"
            type="number"
            min="1"
            step="1"
            {...register("capacidad")}
            className={claseCampo}
          />
          {errors.capacidad && (
            <p className="mt-1 text-xs text-red-600">
              {errors.capacidad.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="aula-ubicacion" className={claseEtiqueta}>
            Ubicación
          </label>
          <input
            id="aula-ubicacion"
            type="text"
            placeholder="Ej. Primer piso"
            {...register("ubicacion")}
            className={claseCampo}
          />
          {errors.ubicacion && (
            <p className="mt-1 text-xs text-red-600">
              {errors.ubicacion.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="aula-tipo" className={claseEtiqueta}>
            Tipo de aula
          </label>
          <select id="aula-tipo" {...register("tipo")} className={claseCampo}>
            <option value="FISICA">Física</option>
            <option value="VIRTUAL">Virtual</option>
          </select>
          {errors.tipo && (
            <p className="mt-1 text-xs text-red-600">{errors.tipo.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="aula-estado" className={claseEtiqueta}>
            Estado inicial
          </label>
          <select
            id="aula-estado"
            {...register("estado")}
            className={claseCampo}
          >
            <option value="DISPONIBLE">Disponible</option>
            <option value="NO_DISPONIBLE">No disponible</option>
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
          {isSubmitting ? "Registrando..." : "Registrar aula"}
        </button>
      </div>
    </form>
  );
}
