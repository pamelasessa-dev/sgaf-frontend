/**
 * Página para una URL que no existe.
 * Si hay sesión, el enlace vuelve al panel del rol; si no, al login.
 */

import { Link } from "react-router-dom";

import { rutasPorRol } from "./rutasPorRol";
import { useAuthStore } from "../stores/authStore";

export default function PaginaNoEncontrada() {
  const token = useAuthStore((state) => state.token);
  const usuario = useAuthStore((state) => state.usuario);
  const destino =
    token && usuario ? rutasPorRol[usuario.rol] : "/login";

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">
        404
      </p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">
        No encontramos esa página
      </h1>
      <p className="mt-3 text-sm text-slate-600">
        La dirección no corresponde a un módulo del SGAF.
      </p>
      <Link
        to={destino}
        className="mt-6 w-fit rounded-lg bg-indigo-700 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-800"
      >
        Volver
      </Link>
    </main>
  );
}
