/**
 * LoginForm.tsx
 *
 * Formulario visual de inicio de sesión.
 * Utiliza React Hook Form y Zod para validar los campos.
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";

import { loginSchema, type LoginFormData } from "./LoginSchema";

interface LoginFormProps {
  alEnviar: (datos: LoginFormData) => Promise<void>;
  errorLogin: string | null;
}

export default function LoginForm({ alEnviar, errorLogin }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-sky-50 px-4 py-10">
      <section className="w-full max-w-md">
        <div className="rounded-2xl border border-sky-100 bg-white px-7 py-9 shadow-xl shadow-sky-100/70 sm:px-10">
          {/* Encabezado */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-9 w-9"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 9.5 12 4l9 5.5-9 5.5-9-5.5Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 12v5c3.2 2.5 6.8 2.5 10 0v-5"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 9.5V16"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              Bienvenido al SGAF
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Sistema de Gestión Académica y Financiera
            </p>
          </div>

          {/* Formulario */}
          <form
            onSubmit={handleSubmit(alEnviar)}
            className="space-y-5"
            noValidate
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Correo electrónico
              </label>

              <input
                id="email"
                type="email"
                autoComplete="username"
                placeholder="ejemplo@correo.com"
                {...register("email")}
                aria-invalid={Boolean(errors.email)}
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                  errors.email
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-slate-200 focus:border-sky-500 focus:ring-sky-100"
                }`}
              />

              {errors.email && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Contraseña
              </label>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Ingresá tu contraseña"
                {...register("password")}
                aria-invalid={Boolean(errors.password)}
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                  errors.password
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-slate-200 focus:border-sky-500 focus:ring-sky-100"
                }`}
              />

              {errors.password && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Error devuelto por el backend */}
            {errorLogin && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {errorLogin}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center rounded-xl bg-sky-600 px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-sky-200 transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            ¿Todavía no tenés una cuenta?{" "}
            <Link
              to="/registro"
              className="font-semibold text-sky-700 hover:text-sky-800 hover:underline"
            >
              Registrate aquí
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          SGAF · Sistema de Gestión Académica y Financiera
        </p>
      </section>
    </main>
  );
}
