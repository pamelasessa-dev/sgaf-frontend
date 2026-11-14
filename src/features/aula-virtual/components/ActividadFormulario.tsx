import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  actividadSchema,
  type DatosActividadFormulario,
} from "../schemas/actividadSchema";

import type {
  ActividadAcademica,
  CrearActividadDto,
} from "../../../types/aulaVirtual";

interface ActividadFormularioProps {
  idGrupo: number;
  actividad?: ActividadAcademica;
  onGuardar: (datos: CrearActividadDto) => Promise<void>;
  onCancelar: () => void;
}

// Convierte una fecha ISO a formato datetime-local.
function convertirFechaLocal(fecha?: string): string {
  if (!fecha) return "";

  const valor = new Date(fecha);

  const ajustar = (numero: number) => String(numero).padStart(2, "0");

  return (
    `${valor.getFullYear()}-${ajustar(valor.getMonth() + 1)}-` +
    `${ajustar(valor.getDate())}T${ajustar(valor.getHours())}:` +
    `${ajustar(valor.getMinutes())}`
  );
}

export default function ActividadFormulario({
  idGrupo,
  actividad,
  onGuardar,
  onCancelar,
}: ActividadFormularioProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<
    import("zod").z.input<typeof actividadSchema>,
    unknown,
    DatosActividadFormulario
  >({
    resolver: zodResolver(actividadSchema),
    defaultValues: {
      titulo: "",
      descripcion: "",
      tipo: "TAREA",
      puntaje_maximo: 100,
      porcentaje_aporte: 10,
      fecha_apertura: "",
      fecha_cierre: "",
    },
  });

  // Cargar los datos cuando se edita una actividad.
  useEffect(() => {
    if (actividad) {
      reset({
        titulo: actividad.titulo,
        descripcion: actividad.descripcion ?? "",
        tipo: actividad.tipo,
        puntaje_maximo: Number(actividad.puntaje_maximo),
        porcentaje_aporte: Number(actividad.porcentaje_aporte),
        fecha_apertura: convertirFechaLocal(actividad.fecha_apertura),
        fecha_cierre: convertirFechaLocal(actividad.fecha_cierre),
      });
    } else {
      reset({
        titulo: "",
        descripcion: "",
        tipo: "TAREA",
        puntaje_maximo: 100,
        porcentaje_aporte: 10,
        fecha_apertura: "",
        fecha_cierre: "",
      });
    }
  }, [actividad, reset]);

  // Preparar y enviar los datos al componente principal.
  const enviarFormulario = async (datos: DatosActividadFormulario) => {
    const datosActividad: CrearActividadDto = {
      id_grupo: idGrupo,
      titulo: datos.titulo,
      descripcion: datos.descripcion?.trim() || undefined,
      tipo: datos.tipo,
      puntaje_maximo: datos.puntaje_maximo,
      porcentaje_aporte: datos.porcentaje_aporte,
      fecha_apertura: new Date(datos.fecha_apertura).toISOString(),
      fecha_cierre: new Date(datos.fecha_cierre).toISOString(),
    };

    await onGuardar(datosActividad);
  };

  const claseCampo =
    "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  const claseError = "mt-1 text-xs text-red-600";

  return (
    <form
      onSubmit={handleSubmit(enviarFormulario)}
      className="space-y-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {actividad ? "Editar actividad" : "Nueva actividad"}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Completa los datos de la actividad académica.
        </p>
      </div>

      {/* Título */}
      <div>
        <label className="text-sm font-medium text-gray-700">Título *</label>

        <input
          {...register("titulo")}
          className={claseCampo}
          placeholder="Ej. Trabajo práctico 1"
        />

        {errors.titulo && <p className={claseError}>{errors.titulo.message}</p>}
      </div>

      {/* Descripción */}
      <div>
        <label className="text-sm font-medium text-gray-700">Descripción</label>

        <textarea
          {...register("descripcion")}
          rows={3}
          className={claseCampo}
          placeholder="Describe las instrucciones de la actividad..."
        />
      </div>

      {/* Tipo de actividad */}
      <div>
        <label className="text-sm font-medium text-gray-700">
          Tipo de actividad *
        </label>

        <select {...register("tipo")} className={claseCampo}>
          <option value="TAREA">Tarea</option>
          <option value="PARCIAL">Parcial</option>
          <option value="PROYECTO">Proyecto</option>
          <option value="EXAMEN">Examen</option>
        </select>

        {errors.tipo && <p className={claseError}>{errors.tipo.message}</p>}
      </div>

      {/* Puntaje y porcentaje */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Puntaje máximo *
          </label>

          <input
            type="number"
            min="1"
            step="0.01"
            {...register("puntaje_maximo")}
            className={claseCampo}
          />

          {errors.puntaje_maximo && (
            <p className={claseError}>{errors.puntaje_maximo.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Porcentaje de aporte *
          </label>

          <div className="relative">
            <input
              type="number"
              min="1"
              max="100"
              step="0.01"
              {...register("porcentaje_aporte")}
              className={`${claseCampo} pr-9`}
            />

            <span className="absolute right-3 top-3 text-sm text-gray-500">
              %
            </span>
          </div>

          {errors.porcentaje_aporte && (
            <p className={claseError}>{errors.porcentaje_aporte.message}</p>
          )}
        </div>
      </div>

      {/* Fechas */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Fecha de apertura *
          </label>

          <input
            type="datetime-local"
            {...register("fecha_apertura")}
            className={claseCampo}
          />

          {errors.fecha_apertura && (
            <p className={claseError}>{errors.fecha_apertura.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Fecha de cierre *
          </label>

          <input
            type="datetime-local"
            {...register("fecha_cierre")}
            className={claseCampo}
          />

          {errors.fecha_cierre && (
            <p className={claseError}>{errors.fecha_cierre.message}</p>
          )}
        </div>
      </div>

      {errors.fecha_cierre && (
        <p className={claseError}>{errors.fecha_cierre.message}</p>
      )}

      {/* Botones */}
      <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={onCancelar}
          disabled={isSubmitting}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Guardando..."
            : actividad
              ? "Guardar cambios"
              : "Crear actividad"}
        </button>
      </div>
    </form>
  );
}
