import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { crearProfesor } from "../../../services/profesorService";
import {
  profesorSchema,
  type ProfesorFormulario as ProfesorFormularioType,
} from "./profesorSchema";

interface ProfesorFormularioProps {
  onProfesorCreado: () => void;
}

export default function ProfesorFormulario({
  onProfesorCreado,
}: ProfesorFormularioProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfesorFormularioType>({
    resolver: zodResolver(profesorSchema),
  });

  async function onSubmit(datos: ProfesorFormularioType) {
    try {
      await crearProfesor(datos);
      onProfesorCreado();
      reset();
      alert("Profesor registrado correctamente.");
    } catch (error) {
      console.error("Error al registrar profesor:", error);
      alert("No se pudo registrar el profesor.");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100";

  const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

  const errorClass = "mt-1 text-xs font-medium text-red-500";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm"
    >
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-6 text-white sm:px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl">
            👨‍🏫
          </div>
          <div>
            <h2 className="text-xl font-bold">Registrar nuevo profesor</h2>
            <p className="mt-1 text-sm text-teal-50">
              Completá los datos para incorporar un profesor al sistema.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-7 p-6 sm:p-8">
        <section>
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-100 text-lg">
              👤
            </span>
            <div>
              <h3 className="font-bold text-slate-800">Datos personales</h3>
              <p className="text-xs text-slate-500">
                Información de identificación del profesor.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Primer nombre *</label>
              <input
                {...register("primer_nombre")}
                placeholder="Ingresar primer nombre"
                className={inputClass}
              />
              {errors.primer_nombre && (
                <p className={errorClass}>{errors.primer_nombre.message}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Segundo nombre</label>
              <input
                {...register("segundo_nombre")}
                placeholder="Ingresar segundo nombre"
                className={inputClass}
              />
              {errors.segundo_nombre && (
                <p className={errorClass}>{errors.segundo_nombre.message}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Primer apellido *</label>
              <input
                {...register("primer_apellido")}
                placeholder="Ingresar primer apellido"
                className={inputClass}
              />
              {errors.primer_apellido && (
                <p className={errorClass}>{errors.primer_apellido.message}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Segundo apellido</label>
              <input
                {...register("segundo_apellido")}
                placeholder="Ingresar segundo apellido"
                className={inputClass}
              />
              {errors.segundo_apellido && (
                <p className={errorClass}>{errors.segundo_apellido.message}</p>
              )}
            </div>
          </div>
        </section>

        <div className="h-px bg-slate-100" />

        <section>
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-lg">
              🔐
            </span>
            <div>
              <h3 className="font-bold text-slate-800">Acceso al sistema</h3>
              <p className="text-xs text-slate-500">
                Credenciales de ingreso del profesor.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Correo electrónico *</label>
              <input
                type="email"
                {...register("email")}
                placeholder="profesor@institucion.com"
                className={inputClass}
              />
              {errors.email && (
                <p className={errorClass}>{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Contraseña *</label>
              <input
                type="password"
                {...register("password")}
                placeholder="Ingresar contraseña"
                className={inputClass}
              />
              {errors.password && (
                <p className={errorClass}>{errors.password.message}</p>
              )}
            </div>
          </div>
        </section>

        <div className="h-px bg-slate-100" />

        <section>
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-100 text-lg">
              🎓
            </span>
            <div>
              <h3 className="font-bold text-slate-800">
                Información profesional
              </h3>
              <p className="text-xs text-slate-500">
                Datos laborales y académicos.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Especialidad *</label>
              <input
                {...register("especialidad")}
                placeholder="Ej. Matemáticas"
                className={inputClass}
              />
              {errors.especialidad && (
                <p className={errorClass}>{errors.especialidad.message}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Fecha de contratación *</label>
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

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Limpiar campos
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-teal-600 px-7 py-3 text-sm font-bold text-white shadow-md shadow-teal-100 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Registrando..." : "Registrar profesor"}
          </button>
        </div>
      </div>
    </form>
  );
}
