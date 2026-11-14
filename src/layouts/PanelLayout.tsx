/**
 * PanelLayout
 *
 * Marco principal de las pantallas autenticadas del SGAF.
 * Incluye navegación lateral en escritorio y navegación adaptable
 * en dispositivos móviles.
 *
 * Conserva:
 * - Menú dinámico según el rol.
 * - Protección de rutas mediante App.tsx.
 * - Cierre de sesión desde el perfil.
 * - Carga diferida de las páginas con React.lazy.
 * - Selector de tema claro, oscuro y automático.
 */

import { Suspense, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

import { EstadoCarga } from "../components/ui";
import { useCerrarSesion } from "../hooks/useCerrarSesion";
import { useMenuPorRol } from "../hooks/useMenuPorRol";
import { useAuthStore } from "../stores/authStore";
import { useTheme } from "../contexts/ThemeContext";

function claseEnlace({ isActive }: { isActive: boolean }) {
  return [
    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
    isActive
      ? "bg-[#E1F4F4] text-[#279EAA] shadow-sm"
      : "text-slate-600 hover:bg-slate-100 hover:text-[#279EAA]",
  ].join(" ");
}

function nombreRol(rol?: string) {
  const nombres: Record<string, string> = {
    ADMIN: "Administrador",
    RECEPCIONISTA: "Recepcionista",
    PROFESOR: "Profesor",
    ESTUDIANTE: "Estudiante",
  };

  return rol ? (nombres[rol] ?? rol) : "Usuario";
}

export default function PanelLayout() {
  const [perfilAbierto, setPerfilAbierto] = useState(false);

  const { theme, setTheme } = useTheme();

  const usuario = useAuthStore((state) => state.usuario);
  const enlaces = useMenuPorRol(usuario?.rol);
  const cerrarSesion = useCerrarSesion();

  const inicial = usuario?.email?.charAt(0).toUpperCase() ?? "U";

  const rutaPerfil = usuario
    ? {
        ADMIN: "/admin/perfil",
        RECEPCIONISTA: "/recepcion/perfil",
        PROFESOR: "/profesor/perfil",
        ESTUDIANTE: "/estudiante/perfil",
      }[usuario.rol]
    : "/login";

  return (
    <div className="min-h-screen bg-[#F4F7FA] text-slate-800 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex min-h-screen">
        {/* =========================================
            MENÚ LATERAL
        ========================================= */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 md:flex">
          {/* Identidad del sistema */}
          <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6 dark:border-slate-700">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#279EAA] text-xl font-bold text-white shadow-lg">
              S
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-700 dark:text-white">
                SGAF
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gestión académica y financiera
              </p>
            </div>
          </div>

          {/* Navegación dinámica */}
          <nav
            aria-label="Menú principal"
            className="flex-1 space-y-2 overflow-y-auto px-4 py-6"
          >
            <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Menú principal
            </p>

            {enlaces.map((enlace) => (
              <NavLink
                key={enlace.to}
                to={enlace.to}
                end={enlace.fin}
                className={claseEnlace}
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-80" />
                <span>{enlace.etiqueta}</span>
              </NavLink>
            ))}
          </nav>

          {/* Información del usuario */}
          <div className="border-t border-slate-100 p-4 dark:border-slate-700">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E1F4F4] font-bold text-[#279EAA] dark:bg-[#279EAA]/20 dark:text-[#7DE0E5]">
                {inicial}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-700 dark:text-white">
                  {usuario?.email ?? "Usuario"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {nombreRol(usuario?.rol)}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* =========================================
            CONTENIDO PRINCIPAL
        ========================================= */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* ENCABEZADO */}
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
            <div className="flex min-h-20 items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
              {/* Marca para móviles */}
              <div className="flex items-center gap-3 md:hidden">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#279EAA] font-bold text-white shadow-sm">
                  S
                </div>

                <div>
                  <p className="font-bold text-[#192F4B] dark:text-white">
                    SGAF
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Panel de gestión
                  </p>
                </div>
              </div>

              {/* Título en escritorio */}
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-[#192F4B] dark:text-white">
                  Sistema de Gestión Académica y Financiera
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Panel de administración y seguimiento
                </p>
              </div>

              {/* Perfil desplegable */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setPerfilAbierto((abierto) => !abierto)}
                  aria-expanded={perfilAbierto}
                  aria-haspopup="true"
                  aria-label="Abrir menú de usuario"
                  className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <div className="hidden text-right sm:block">
                    <p className="max-w-56 truncate text-sm font-semibold text-[#192F4B] dark:text-white">
                      {usuario?.email ?? "Usuario"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {nombreRol(usuario?.rol)}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#279EAA]/20 bg-[#E1F4F4] font-bold text-[#167F88]">
                    {inicial}
                  </div>

                  <svg
                    className={`h-4 w-4 text-slate-500 transition-transform dark:text-slate-300 ${
                      perfilAbierto ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                  >
                    <path
                      d="m5 7.5 5 5 5-5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* Opciones del usuario */}
                {perfilAbierto && (
                  <>
                    <button
                      type="button"
                      aria-label="Cerrar menú de usuario"
                      className="fixed inset-0 z-30 cursor-default"
                      onClick={() => setPerfilAbierto(false)}
                    />

                    <div className="absolute right-0 top-full z-40 mt-2 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
                      {/* Información del perfil */}
                      <div className="border-b border-slate-100 bg-[#F4F7FA] p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="truncate text-sm font-semibold text-[#192F4B] dark:text-white">
                          {usuario?.email ?? "Usuario"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {nombreRol(usuario?.rol)}
                        </p>
                      </div>

                      <div className="p-2">
                        {/* Selector de apariencia */}
                        <div className="mb-2 border-b border-slate-100 px-2 pb-3 dark:border-slate-700">
                          <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Apariencia
                          </p>

                          <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                            <button
                              type="button"
                              onClick={() => setTheme("light")}
                              aria-pressed={theme === "light"}
                              className={`rounded-lg px-2 py-2 text-xs font-medium transition-colors ${
                                theme === "light"
                                  ? "bg-white text-[#167F88] shadow-sm dark:bg-slate-600 dark:text-white"
                                  : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                              }`}
                            >
                              ☀️ Claro
                            </button>

                            <button
                              type="button"
                              onClick={() => setTheme("dark")}
                              aria-pressed={theme === "dark"}
                              className={`rounded-lg px-2 py-2 text-xs font-medium transition-colors ${
                                theme === "dark"
                                  ? "bg-white text-[#167F88] shadow-sm dark:bg-slate-600 dark:text-white"
                                  : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                              }`}
                            >
                              🌙 Oscuro
                            </button>

                            <button
                              type="button"
                              onClick={() => setTheme("system")}
                              aria-pressed={theme === "system"}
                              className={`rounded-lg px-2 py-2 text-xs font-medium transition-colors ${
                                theme === "system"
                                  ? "bg-white text-[#167F88] shadow-sm dark:bg-slate-600 dark:text-white"
                                  : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                              }`}
                            >
                              💻 Auto
                            </button>
                          </div>
                        </div>

                        {/* Mi perfil */}
                        <NavLink
                          to={rutaPerfil}
                          onClick={() => setPerfilAbierto(false)}
                          className={({ isActive }) =>
                            [
                              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                              isActive
                                ? "bg-[#E1F4F4] text-[#167F88] dark:bg-[#167F88]/20 dark:text-[#7DE0E5]"
                                : "text-slate-700 hover:bg-slate-50 hover:text-[#167F88] dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-[#7DE0E5]",
                            ].join(" ")
                          }
                        >
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            aria-hidden="true"
                          >
                            <circle cx="12" cy="8" r="4" />
                            <path
                              d="M4 21a8 8 0 0 1 16 0"
                              strokeLinecap="round"
                            />
                          </svg>
                          Mi perfil
                        </NavLink>

                        {/* Único cierre de sesión */}
                        <button
                          type="button"
                          onClick={() => {
                            setPerfilAbierto(false);
                            cerrarSesion();
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                        >
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            aria-hidden="true"
                          >
                            <path
                              d="M10 17l5-5-5-5M15 12H3m9-9h6a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Cerrar sesión
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* NAVEGACIÓN MÓVIL */}
            <nav
              aria-label="Navegación móvil"
              className="flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-3 dark:border-slate-700 md:hidden"
            >
              {enlaces.map((enlace) => (
                <NavLink
                  key={enlace.to}
                  to={enlace.to}
                  end={enlace.fin}
                  className={({ isActive }) =>
                    [
                      "shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
                      isActive
                        ? "bg-[#279EAA] text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-[#E1F4F4] hover:text-[#167F88] dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-[#7DE0E5]",
                    ].join(" ")
                  }
                >
                  {enlace.etiqueta}
                </NavLink>
              ))}
            </nav>
          </header>

          {/* ÁREA DE TRABAJO */}
          <main className="w-full flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <div className="mx-auto w-full max-w-7xl sgaf-animate-in">
              <Suspense fallback={<EstadoCarga mensaje="Cargando módulo..." />}>
                <Outlet />
              </Suspense>
            </div>
          </main>

          {/* PIE DE PÁGINA */}
          <footer className="border-t border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
              SGAF · Sistema de Gestión Académica y Financiera
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
