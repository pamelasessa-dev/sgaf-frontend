import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  profesorEditarSchema,
  type ProfesorEditarFormulario as ProfesorEditarFormularioType,
} from "./profesorSchema";

import type { Profesor } from "../../../types/profesor";
import { actualizarProfesor } from "../../../services/profesorService";

interface ProfesorEditarFormularioProps {
  profesor: Profesor;
  onProfesorActualizado: () => void;
}

export default function ProfesorEditarFormulario({
  profesor,
  onProfesorActualizado,
}: ProfesorEditarFormularioProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfesorEditarFormularioType>({
    resolver: zodResolver(profesorEditarSchema),
    defaultValues: {
      primer_nombre: profesor.usuario.primer_nombre,
      segundo_nombre: profesor.usuario.segundo_nombre ?? "",
      primer_apellido: profesor.usuario.primer_apellido,
      segundo_apellido: profesor.usuario.segundo_apellido ?? "",
      email: profesor.usuario.email,
      especialidad: profesor.especialidad,
      fecha_contratacion: profesor.fecha_contratacion.slice(0, 10),
    },
  });

  async function onSubmit(datos: ProfesorEditarFormularioType) {
    try {
      await actualizarProfesor(profesor.id_profesor, datos);
      onProfesorActualizado();
      alert("Profesor actualizado correctamente.");
    } catch (error) {
      console.error("Error al actualizar profesor:", error);
      alert("No se pudo actualizar el profesor.");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100";

  const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

  const errorClass = "mt-1 text-xs font-medium text-red-500";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm"
    >
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-6 text-white">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl">
            ✏️
          </div>
          <div>
            <h2 className="text-xl font-bold">Editar profesor</h2>
            <p className="mt-1 text-sm text-teal-50">
              Modificá la información del profesor seleccionado.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6 sm:p-8">
        <section>
          <h3 className="mb-4 font-bold text-slate-800">Datos personales</h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Primer nombre</label>
              <input {...register("primer_nombre")} className={inputClass} />
              {errors.primer_nombre && (
                <p className={errorClass}>{errors.primer_nombre.message}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Segundo nombre</label>
              <input {...register("segundo_nombre")} className={inputClass} />
              {errors.segundo_nombre && (
                <p className={errorClass}>{errors.segundo_nombre.message}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Primer apellido</label>
              <input {...register("primer_apellido")} className={inputClass} />
              {errors.primer_apellido && (
                <p className={errorClass}>{errors.primer_apellido.message}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Segundo apellido</label>
              <input {...register("segundo_apellido")} className={inputClass} />
              {errors.segundo_apellido && (
                <p className={errorClass}>{errors.segundo_apellido.message}</p>
              )}
            </div>
          </div>
        </section>

        <div className="h-px bg-slate-100" />

        <section>
          <h3 className="mb-4 font-bold text-slate-800">Datos de contacto</h3>
          <div>
            <label className={labelClass}>Correo electrónico</label>
            <input type="email" {...register("email")} className={inputClass} />
            {errors.email && (
              <p className={errorClass}>{errors.email.message}</p>
            )}
          </div>
        </section>

        <div className="h-px bg-slate-100" />

        <section>
          <h3 className="mb-4 font-bold text-slate-800">
            Información profesional
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Especialidad</label>
              <input {...register("especialidad")} className={inputClass} />
              {errors.especialidad && (
                <p className={errorClass}>{errors.especialidad.message}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Fecha de contratación</label>
              <input
                type="date"
                {...register("fecha_contratacion")}
                className={inputClass}
              />
              {errors.fecha_contratacion && (
                <p className={errorClass}>
                  {errors.fecha_contratacion.message}
                </p>
              )}
            </div>
          </div>
        </section>

        <div className="flex justify-end border-t border-slate-100 pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-teal-600 px-7 py-3 text-sm font-bold text-white shadow-md shadow-teal-100 transition hover:bg-teal-700 disabled:opacity-60"
          >
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </form>
  );
}
