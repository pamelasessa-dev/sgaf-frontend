import { useState } from "react";
import { Link } from "react-router-dom";
import { isAxiosError } from "axios";

import RegistroForm from "./RegistroForm";
import type { RegistroFormData } from "./RegistroSchema";
import { registrarPostulante } from "../../services/authService";

function obtenerMensajeError(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.response?.status === 409) {
      return "Ya existe una cuenta registrada con ese correo electrónico.";
    }

    const mensaje = error.response?.data?.message;

    if (Array.isArray(mensaje)) {
      return mensaje.join(" ");
    }

    if (typeof mensaje === "string") {
      return mensaje;
    }
  }

  return "No fue posible enviar tu solicitud. Intentá nuevamente.";
}

export default function RegistroPage() {
  const [errorRegistro, setErrorRegistro] = useState<string | null>(null);
  const [registroExitoso, setRegistroExitoso] = useState(false);

  async function manejarRegistro(datos: RegistroFormData) {
    setErrorRegistro(null);

    try {
      await registrarPostulante(datos);
      setRegistroExitoso(true);
    } catch (error) {
      setErrorRegistro(obtenerMensajeError(error));
    }
  }

  return (
    <main className="min-h-screen bg-sky-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <header className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-100 text-3xl">
            🎓
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
            Registro de postulante
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sistema de Gestión Académica y Financiera
          </p>
        </header>

        <section className="rounded-2xl border border-sky-100 bg-white p-6 shadow-xl shadow-sky-100/70 sm:p-9">
          {registroExitoso ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
                ✓
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                ¡Solicitud enviada!
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600">
                Tu registro fue recibido correctamente. Tu postulación quedó
                pendiente de revisión por parte de Recepción. Podrás iniciar
                sesión cuando tu solicitud sea aprobada.
              </p>
              <Link
                to="/login"
                className="mt-7 inline-flex items-center justify-center rounded-xl bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
              >
                Volver al inicio de sesión
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-7">
                <h2 className="text-xl font-bold text-slate-800">
                  Completá tus datos
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Ingresá la información solicitada para crear tu postulación.
                </p>
              </div>

              <RegistroForm
                alEnviar={manejarRegistro}
                errorRegistro={errorRegistro}
              />

              <p className="mt-7 text-center text-sm text-slate-500">
                ¿Ya tenés una cuenta?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-cyan-700 hover:text-cyan-800 hover:underline"
                >
                  Iniciá sesión
                </Link>
              </p>
            </>
          )}
        </section>

        <p className="mt-6 text-center text-xs text-slate-400">
          SGAF · Sistema de Gestión Académica y Financiera
        </p>
      </div>
    </main>
  );
}
