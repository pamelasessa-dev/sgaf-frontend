/**
 * HorarioEditarFormulario.tsx
 *
 * Formulario para modificar un horario académico.
 */

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { actualizarHorario } from "../../../services/horarioService";

import type { Horario } from "../../../types/horario";
import type { HorarioEditarFormulario as DatosHorario } from "./horarioSchema";

import { horarioEditarSchema } from "./horarioSchema";

interface HorarioEditarFormularioProps {
  horario: Horario;
  onHorarioActualizado: () => void | Promise<void>;
  onCancelar: () => void;
}

// Días disponibles para programar clases.
const DIAS_SEMANA = [
  { valor: "LUNES", etiqueta: "Lunes" },
  { valor: "MARTES", etiqueta: "Martes" },
  { valor: "MIERCOLES", etiqueta: "Miércoles" },
  { valor: "JUEVES", etiqueta: "Jueves" },
  { valor: "VIERNES", etiqueta: "Viernes" },
  { valor: "SABADO", etiqueta: "Sábado" },
  { valor: "DOMINGO", etiqueta: "Domingo" },
];

// Extrae HH:mm sin convertir la fecha a la zona horaria local.
function extraerHora(valor: string): string {
  if (/^\d{2}:\d{2}$/.test(valor)) {
    return valor;
  }

  const coincidencia = valor.match(/T(\d{2}:\d{2})/);

  return coincidencia?.[1] ?? "";
}

export default function HorarioEditarFormulario({
  horario,
  onHorarioActualizado,
  onCancelar,
}: HorarioEditarFormularioProps) {
  const [guardando, setGuardando] = useState(false);
  const [errorApi, setErrorApi] = useState("");

  // Configuración del formulario.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DatosHorario>({
    resolver: zodResolver(horarioEditarSchema),
    defaultValues: {
      dia_semana: horario.dia_semana,
      hora_inicio: extraerHora(horario.hora_inicio),
      hora_fin: extraerHora(horario.hora_fin),
    },
  });

  // Actualiza los valores cuando cambia el horario seleccionado.
  useEffect(() => {
    reset({
      dia_semana: horario.dia_semana,
      hora_inicio: extraerHora(horario.hora_inicio),
      hora_fin: extraerHora(horario.hora_fin),
    });

    setErrorApi("");
  }, [horario, reset]);

  // Guarda los cambios en el backend.
  async function manejarActualizacion(datos: DatosHorario) {
    try {
      setGuardando(true);
      setErrorApi("");

      await actualizarHorario(horario.id_horario, datos);

      await onHorarioActualizado();
    } catch (error: unknown) {
      console.error("Error al actualizar horario:", error);

      const errorApi = error as {
        response?: {
          data?: {
            message?: string | string[];
          };
        };
      };

      const mensaje = errorApi.response?.data?.message;

      setErrorApi(
        Array.isArray(mensaje)
          ? mensaje.join(", ")
          : mensaje || "No fue posible actualizar el horario.",
      );
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(manejarActualizacion)}
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
    >
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Modificar horario
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Actualiza el día y el rango horario del grupo.
        </p>
      </div>

      {errorApi && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorApi}
        </div>
      )}

      {/* Información del grupo asociado */}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
          Grupo asociado
        </p>

        <p className="mt-1 font-semibold text-slate-900">
          {horario.grupo?.nombre ?? `Grupo #${horario.id_grupo}`}
        </p>

        <p className="mt-1 text-sm text-slate-600">
          Materia:{" "}
          {horario.grupo?.materia?.nombre ??
            `Materia #${horario.grupo?.id_materia ?? "—"}`}
        </p>

        <p className="mt-1 text-sm text-slate-600">
          Período: {horario.grupo?.periodo?.nombre ?? "Sin información"}
        </p>

        <p className="mt-1 text-sm text-slate-600">
          Aula: {horario.grupo?.aula?.nombre ?? "Sin información"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Día de la semana */}
        <div className="md:col-span-2">
          <label
            htmlFor="editar-dia-semana"
            className="mb-1.5 block text-sm font-semibold text-slate-700"
          >
            Día de la semana *
          </label>

          <select
            id="editar-dia-semana"
            {...register("dia_semana")}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          >
            {DIAS_SEMANA.map((dia) => (
              <option key={dia.valor} value={dia.valor}>
                {dia.etiqueta}
              </option>
            ))}
          </select>

          {errors.dia_semana && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.dia_semana.message}
            </p>
          )}
        </div>

        {/* Hora de inicio */}
        <div>
          <label
            htmlFor="editar-hora-inicio"
            className="mb-1.5 block text-sm font-semibold text-slate-700"
          >
            Hora de inicio *
          </label>

          <input
            id="editar-hora-inicio"
            type="time"
            {...register("hora_inicio")}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          />

          {errors.hora_inicio && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.hora_inicio.message}
            </p>
          )}
        </div>

        {/* Hora de finalización */}
        <div>
          <label
            htmlFor="editar-hora-fin"
            className="mb-1.5 block text-sm font-semibold text-slate-700"
          >
            Hora de finalización *
          </label>

          <input
            id="editar-hora-fin"
            type="time"
            {...register("hora_fin")}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          />

          {errors.hora_fin && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.hora_fin.message}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <p className="font-semibold">Nota</p>
        <p className="mt-1">
          El grupo asociado no se puede cambiar desde esta edición. La hora de
          finalización debe ser posterior a la de inicio.
        </p>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancelar}
          disabled={guardando}
          className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={guardando}
          className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
