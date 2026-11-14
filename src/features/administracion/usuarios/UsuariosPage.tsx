/**
 * UsuariosPage.tsx
 *
 * Gestión de usuarios del SGAF.
 * Conserva búsqueda, filtros, aprobación y cambio de estados.
 */

import { useEffect, useMemo, useState } from "react";

import {
  obtenerUsuarios,
  aprobarPostulante,
  actualizarEstadoUsuario,
} from "../../../services/usuarioService";

import type { UsuarioSistema, EstadoUsuario } from "../../../types/usuario";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<UsuarioSistema[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [procesandoId, setProcesandoId] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("TODOS");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");

  async function cargarUsuarios() {
    try {
      setError("");
      const datos = await obtenerUsuarios();
      setUsuarios(datos);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      setError("No se pudieron cargar los usuarios. Intenta nuevamente.");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    void cargarUsuarios();
  }, []);

  const obtenerNombreCompleto = (usuario: UsuarioSistema) =>
    [
      usuario.primer_nombre,
      usuario.segundo_nombre,
      usuario.primer_apellido,
      usuario.segundo_apellido,
    ]
      .filter(Boolean)
      .join(" ");

  const usuariosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return usuarios.filter((usuario) => {
      const nombre = obtenerNombreCompleto(usuario).toLowerCase();

      const coincideBusqueda =
        !termino ||
        nombre.includes(termino) ||
        usuario.email.toLowerCase().includes(termino) ||
        String(usuario.id_usuario).includes(termino);

      const coincideRol = filtroRol === "TODOS" || usuario.rol === filtroRol;

      const coincideEstado =
        filtroEstado === "TODOS" || usuario.estado === filtroEstado;

      return coincideBusqueda && coincideRol && coincideEstado;
    });
  }, [usuarios, busqueda, filtroRol, filtroEstado]);

  const pendientes = usuarios.filter(
    (usuario) => usuario.rol === "ESTUDIANTE" && usuario.estado === "PENDIENTE",
  ).length;

  const activos = usuarios.filter(
    (usuario) => usuario.estado === "ACTIVO",
  ).length;

  const suspendidos = usuarios.filter(
    (usuario) => usuario.estado === "SUSPENDIDO",
  ).length;

  async function manejarAprobacion(id: number) {
    const confirmar = window.confirm("¿Deseas aprobar a este postulante?");
    if (!confirmar) return;

    try {
      setProcesandoId(id);
      setError("");
      setMensaje("");

      await aprobarPostulante(id);
      await cargarUsuarios();

      setMensaje("Postulante aprobado correctamente.");
    } catch (error) {
      console.error("Error al aprobar postulante:", error);
      setError("No se pudo aprobar al postulante.");
    } finally {
      setProcesandoId(null);
    }
  }

  async function manejarCambioEstado(id: number, nuevoEstado: EstadoUsuario) {
    const confirmar = window.confirm(
      `¿Deseas cambiar el estado del usuario a ${nuevoEstado}?`,
    );

    if (!confirmar) return;

    try {
      setProcesandoId(id);
      setError("");
      setMensaje("");

      await actualizarEstadoUsuario(id, nuevoEstado);
      await cargarUsuarios();

      setMensaje("Estado del usuario actualizado correctamente.");
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      setError("No se pudo actualizar el estado del usuario.");
    } finally {
      setProcesandoId(null);
    }
  }

  function obtenerClaseEstado(estado: EstadoUsuario) {
    const clases: Record<string, string> = {
      ACTIVO: "bg-[#DDF3E5] text-[#328456]",
      PENDIENTE: "bg-[#FFF6C9] text-[#92721A]",
      SUSPENDIDO: "bg-red-100 text-red-700",
      INACTIVO: "bg-slate-100 text-slate-600",
    };

    return clases[estado] ?? "bg-slate-100 text-slate-600";
  }

  if (cargando) {
    return (
      <div className="flex min-h-[350px] flex-col items-center justify-center gap-4">
        <div className="h-11 w-11 animate-spin rounded-full border-4 border-[#DFF3FA] border-t-[#279EAA]" />
        <p className="text-sm font-medium text-slate-500">
          Cargando usuarios...
        </p>
      </div>
    );
  }

  return (
    <main className="space-y-7">
      {/* Encabezado */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#DFF3FA] via-[#E9F7F5] to-[#DDF3E5] p-6 sm:p-8">
        <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/40" />

        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#279EAA]">
              Administración / Usuarios
            </p>
            <h1 className="mt-3 text-3xl font-bold text-[#192F4B]">
              Gestión de usuarios
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
              Consulta las cuentas del sistema, revisa postulantes y administra
              los permisos de acceso según el estado de cada usuario.
            </p>
          </div>

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 text-3xl shadow-sm">
            👥
          </div>
        </div>
      </section>

      {/* Mensajes */}
      {mensaje && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-xl border border-[#A9DDBD] bg-[#DDF3E5] p-4 text-sm text-[#328456]"
        >
          <span className="font-bold">✓</span>
          <p>{mensaje}</p>
          <button
            type="button"
            onClick={() => setMensaje("")}
            className="ml-auto font-bold"
            aria-label="Cerrar mensaje"
          >
            ×
          </button>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <span className="font-bold">!</span>
          <p>{error}</p>
          <button
            type="button"
            onClick={() => setError("")}
            className="ml-auto font-bold"
            aria-label="Cerrar error"
          >
            ×
          </button>
        </div>
      )}

      {/* Indicadores */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-[#BDE8F1] bg-[#DFF3FA] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#236B91]">
              Total de usuarios
            </p>
            <span className="text-2xl">👥</span>
          </div>
          <p className="mt-3 text-3xl font-bold text-[#236B91]">
            {usuarios.length}
          </p>
          <p className="mt-1 text-xs text-[#236B91]/80">Cuentas registradas</p>
        </article>

        <article className="rounded-2xl border border-[#F5D8A8] bg-[#FFF0D9] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#A76520]">
              Postulantes pendientes
            </p>
            <span className="text-2xl">⏳</span>
          </div>
          <p className="mt-3 text-3xl font-bold text-[#A76520]">{pendientes}</p>
          <p className="mt-1 text-xs text-[#A76520]/80">Requieren aprobación</p>
        </article>

        <article className="rounded-2xl border border-[#A9DDBD] bg-[#DDF3E5] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#328456]">
              Usuarios activos
            </p>
            <span className="text-2xl">✓</span>
          </div>
          <p className="mt-3 text-3xl font-bold text-[#328456]">{activos}</p>
          <p className="mt-1 text-xs text-[#328456]/80">
            Con acceso habilitado
          </p>
        </article>

        <article className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-red-700">
              Usuarios suspendidos
            </p>
            <span className="text-2xl">!</span>
          </div>
          <p className="mt-3 text-3xl font-bold text-red-700">{suspendidos}</p>
          <p className="mt-1 text-xs text-red-600">Acceso restringido</p>
        </article>
      </section>

      {/* Directorio */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-[#192F4B]">
              Directorio de usuarios
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Busca, filtra y administra las cuentas registradas.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void cargarUsuarios()}
            className="rounded-xl border border-[#BDE8F1] bg-[#DFF3FA] px-4 py-2.5 text-sm font-semibold text-[#236B91] transition hover:bg-[#BDE8F1]"
          >
            ↻ Actualizar
          </button>
        </div>

        {/* Filtros */}
        <div className="grid gap-4 border-b border-slate-100 bg-[#F4F7FA] p-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label
              htmlFor="buscar-usuario"
              className="mb-2 block text-xs font-semibold text-slate-600"
            >
              Buscar usuario
            </label>
            <input
              id="buscar-usuario"
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              placeholder="Nombre, correo o ID..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#279EAA] focus:ring-2 focus:ring-[#279EAA]/15"
            />
          </div>

          <div>
            <label
              htmlFor="filtro-rol"
              className="mb-2 block text-xs font-semibold text-slate-600"
            >
              Filtrar por rol
            </label>
            <select
              id="filtro-rol"
              value={filtroRol}
              onChange={(event) => setFiltroRol(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#279EAA] focus:ring-2 focus:ring-[#279EAA]/15"
            >
              <option value="TODOS">Todos los roles</option>
              <option value="ADMIN">Administrador</option>
              <option value="RECEPCIONISTA">Recepcionista</option>
              <option value="PROFESOR">Profesor</option>
              <option value="ESTUDIANTE">Estudiante</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="filtro-estado"
              className="mb-2 block text-xs font-semibold text-slate-600"
            >
              Filtrar por estado
            </label>
            <select
              id="filtro-estado"
              value={filtroEstado}
              onChange={(event) => setFiltroEstado(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#279EAA] focus:ring-2 focus:ring-[#279EAA]/15"
            >
              <option value="TODOS">Todos los estados</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="ACTIVO">Activo</option>
              <option value="SUSPENDIDO">Suspendido</option>
              <option value="INACTIVO">Inactivo</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 sm:px-6">
          <p className="text-xs text-slate-500">
            Mostrando{" "}
            <strong className="text-slate-700">
              {usuariosFiltrados.length}
            </strong>{" "}
            de {usuarios.length} usuarios
          </p>

          {(busqueda || filtroRol !== "TODOS" || filtroEstado !== "TODOS") && (
            <button
              type="button"
              onClick={() => {
                setBusqueda("");
                setFiltroRol("TODOS");
                setFiltroEstado("TODOS");
              }}
              className="text-xs font-semibold text-[#279EAA] hover:underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="min-w-[850px] w-full text-left text-sm">
            <thead className="bg-[#F4F7FA] text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold sm:px-6">ID</th>
                <th className="px-5 py-4 font-semibold">Usuario</th>
                <th className="px-5 py-4 font-semibold">Correo</th>
                <th className="px-5 py-4 font-semibold">Rol</th>
                <th className="px-5 py-4 font-semibold">Estado</th>
                <th className="px-5 py-4 text-center font-semibold">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {usuariosFiltrados.map((usuario) => {
                const nombre = obtenerNombreCompleto(usuario);
                const procesando = procesandoId === usuario.id_usuario;

                return (
                  <tr
                    key={usuario.id_usuario}
                    className="transition hover:bg-[#F4F9FB]"
                  >
                    <td className="px-5 py-4 font-medium text-slate-500 sm:px-6">
                      #{usuario.id_usuario}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#279EAA] text-sm font-bold text-white">
                          {nombre.charAt(0).toUpperCase() || "U"}
                        </div>
                        <span className="font-semibold text-[#192F4B]">
                          {nombre || "Sin nombre"}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {usuario.email}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-[#EDE7FA] px-3 py-1.5 text-xs font-semibold text-[#7655A5]">
                        {usuario.rol}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${obtenerClaseEstado(usuario.estado)}`}
                      >
                        {usuario.estado}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-center">
                        {usuario.rol === "ESTUDIANTE" &&
                        usuario.estado === "PENDIENTE" ? (
                          <button
                            type="button"
                            onClick={() =>
                              void manejarAprobacion(usuario.id_usuario)
                            }
                            disabled={procesando}
                            className="rounded-xl bg-[#328456] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#286b45] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {procesando ? "Aprobando..." : "Aprobar"}
                          </button>
                        ) : usuario.rol !== "ADMIN" &&
                          usuario.estado === "ACTIVO" ? (
                          <button
                            type="button"
                            onClick={() =>
                              void manejarCambioEstado(
                                usuario.id_usuario,
                                "SUSPENDIDO",
                              )
                            }
                            disabled={procesando}
                            className="rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                          >
                            {procesando ? "Procesando..." : "Suspender"}
                          </button>
                        ) : usuario.rol !== "ADMIN" &&
                          (usuario.estado === "SUSPENDIDO" ||
                            usuario.estado === "INACTIVO") ? (
                          <button
                            type="button"
                            onClick={() =>
                              void manejarCambioEstado(
                                usuario.id_usuario,
                                "ACTIVO",
                              )
                            }
                            disabled={procesando}
                            className="rounded-xl border border-[#A9DDBD] bg-white px-3 py-2 text-xs font-semibold text-[#328456] transition hover:bg-[#DDF3E5] disabled:opacity-50"
                          >
                            {procesando ? "Procesando..." : "Activar"}
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">
                            Sin acciones
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {usuariosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center">
                    <div className="text-4xl">🔎</div>
                    <p className="mt-3 font-semibold text-[#192F4B]">
                      No se encontraron usuarios
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Prueba modificando la búsqueda o los filtros.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 bg-[#F4F7FA] px-5 py-3">
          <p className="text-xs text-slate-400">
            Los cambios de estado se aplican mediante los servicios del backend.
          </p>
        </div>
      </section>
    </main>
  );
}
