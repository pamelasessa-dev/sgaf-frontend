import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegistroSchema, type RegistroFormData } from "./RegistroSchema";

interface RegistroFormProps {
  alEnviar: (datos: RegistroFormData) => Promise<void>;
  errorRegistro: string | null;
}

const claseInput =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100";

const claseLabel = "mb-1.5 block text-sm font-semibold text-slate-700";

export default function RegistroForm({
  alEnviar,
  errorRegistro,
}: RegistroFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistroFormData>({
    resolver: zodResolver(RegistroSchema),
    defaultValues: {
      primer_nombre: "",
      segundo_nombre: "",
      primer_apellido: "",
      segundo_apellido: "",
      email: "",
      password: "",
      telefono: "",
      fecha_nacimiento: "",
      direccion: "",
      tutor_nombre: "",
      tutor_apellido: "",
      tutor_parentesco: "",
      tutor_telefono: "",
      tutor_email: "",
      tutor_direccion: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(alEnviar)} noValidate className="space-y-7">
      <section>
        <h2 className="mb-1 text-lg font-bold text-slate-800">
          Datos personales
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          Completá tus datos para solicitar el ingreso al SGAF.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={claseLabel} htmlFor="primer_nombre">
              Primer nombre *
            </label>
            <input
              id="primer_nombre"
              {...register("primer_nombre")}
              className={claseInput}
            />
            {errors.primer_nombre && (
              <p className="mt-1 text-xs text-red-600">
                {errors.primer_nombre.message}
              </p>
            )}
          </div>

          <div>
            <label className={claseLabel} htmlFor="segundo_nombre">
              Segundo nombre
            </label>
            <input
              id="segundo_nombre"
              {...register("segundo_nombre")}
              className={claseInput}
            />
          </div>

          <div>
            <label className={claseLabel} htmlFor="primer_apellido">
              Primer apellido *
            </label>
            <input
              id="primer_apellido"
              {...register("primer_apellido")}
              className={claseInput}
            />
            {errors.primer_apellido && (
              <p className="mt-1 text-xs text-red-600">
                {errors.primer_apellido.message}
              </p>
            )}
          </div>

          <div>
            <label className={claseLabel} htmlFor="segundo_apellido">
              Segundo apellido
            </label>
            <input
              id="segundo_apellido"
              {...register("segundo_apellido")}
              className={claseInput}
            />
          </div>

          <div>
            <label className={claseLabel} htmlFor="fecha_nacimiento">
              Fecha de nacimiento *
            </label>
            <input
              id="fecha_nacimiento"
              type="date"
              {...register("fecha_nacimiento")}
              className={claseInput}
            />
            {errors.fecha_nacimiento && (
              <p className="mt-1 text-xs text-red-600">
                {errors.fecha_nacimiento.message}
              </p>
            )}
          </div>

          <div>
            <label className={claseLabel} htmlFor="telefono">
              Teléfono
            </label>
            <input
              id="telefono"
              type="tel"
              {...register("telefono")}
              className={claseInput}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={claseLabel} htmlFor="direccion">
              Dirección
            </label>
            <input
              id="direccion"
              {...register("direccion")}
              className={claseInput}
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-lg font-bold text-slate-800">
          Datos de acceso
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          Estos datos te permitirán ingresar cuando tu postulación sea aprobada.
        </p>

        <div className="space-y-4">
          <div>
            <label className={claseLabel} htmlFor="email">
              Correo electrónico *
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email")}
              className={claseInput}
              placeholder="ejemplo@correo.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className={claseLabel} htmlFor="password">
              Contraseña *
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register("password")}
              className={claseInput}
              placeholder="Ingresá una contraseña"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-lg font-bold text-slate-800">
          Datos del tutor o responsable
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          Indicá los datos de la persona responsable.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={claseLabel} htmlFor="tutor_nombre">
              Nombre del tutor *
            </label>
            <input
              id="tutor_nombre"
              {...register("tutor_nombre")}
              className={claseInput}
            />
            {errors.tutor_nombre && (
              <p className="mt-1 text-xs text-red-600">
                {errors.tutor_nombre.message}
              </p>
            )}
          </div>

          <div>
            <label className={claseLabel} htmlFor="tutor_apellido">
              Apellido del tutor *
            </label>
            <input
              id="tutor_apellido"
              {...register("tutor_apellido")}
              className={claseInput}
            />
            {errors.tutor_apellido && (
              <p className="mt-1 text-xs text-red-600">
                {errors.tutor_apellido.message}
              </p>
            )}
          </div>

          <div>
            <label className={claseLabel} htmlFor="tutor_parentesco">
              Parentesco *
            </label>
            <input
              id="tutor_parentesco"
              {...register("tutor_parentesco")}
              className={claseInput}
              placeholder="Ej. Madre, padre, tutor"
            />
            {errors.tutor_parentesco && (
              <p className="mt-1 text-xs text-red-600">
                {errors.tutor_parentesco.message}
              </p>
            )}
          </div>

          <div>
            <label className={claseLabel} htmlFor="tutor_telefono">
              Teléfono del tutor *
            </label>
            <input
              id="tutor_telefono"
              type="tel"
              {...register("tutor_telefono")}
              className={claseInput}
            />
            {errors.tutor_telefono && (
              <p className="mt-1 text-xs text-red-600">
                {errors.tutor_telefono.message}
              </p>
            )}
          </div>

          <div>
            <label className={claseLabel} htmlFor="tutor_email">
              Correo del tutor
            </label>
            <input
              id="tutor_email"
              type="email"
              {...register("tutor_email")}
              className={claseInput}
            />
            {errors.tutor_email && (
              <p className="mt-1 text-xs text-red-600">
                {errors.tutor_email.message}
              </p>
            )}
          </div>

          <div>
            <label className={claseLabel} htmlFor="tutor_direccion">
              Dirección del tutor
            </label>
            <input
              id="tutor_direccion"
              {...register("tutor_direccion")}
              className={claseInput}
            />
          </div>
        </div>
      </section>

      {errorRegistro && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorRegistro}
        </div>
      )}

      <p className="text-xs text-slate-500">
        Los campos marcados con * son obligatorios. Tu solicitud quedará
        pendiente de revisión por parte de Recepción.
      </p>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center rounded-xl bg-cyan-600 px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-cyan-100 transition hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting
          ? "Enviando solicitud..."
          : "Enviar solicitud de registro"}
      </button>
    </form>
  );
}
