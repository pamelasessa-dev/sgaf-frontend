import { useEffect, useState, type ChangeEvent } from "react";

import {
  actualizarMiFoto,
  actualizarMiPerfil,
  obtenerMiPerfil,
} from "../../services/usuarioService";

import type {
  UsuarioSistema,
  ActualizarMiPerfilRequest,
} from "../../types/usuario";

export default function MiPerfilPage() {
  const [perfil, setPerfil] = useState<UsuarioSistema | null>(null);
  const [formulario, setFormulario] = useState<ActualizarMiPerfilRequest>({});
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const [fotoSeleccionada, setFotoSeleccionada] = useState<File | null>(null);
  const [vistaPrevia, setVistaPrevia] = useState("");
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [mensajeFoto, setMensajeFoto] = useState("");
  const [errorFoto, setErrorFoto] = useState("");

  useEffect(() => {
    async function cargarPerfil() {
      try {
        const datos = await obtenerMiPerfil();

        setPerfil(datos);
        setFormulario({
          primer_nombre: datos.primer_nombre,
          segundo_nombre: datos.segundo_nombre,
          primer_apellido: datos.primer_apellido,
          segundo_apellido: datos.segundo_apellido,
          telefono: datos.telefono,
        });
      } catch (err) {
        console.error("Error al cargar el perfil:", err);
        setError("No se pudo cargar tu perfil.");
      } finally {
        setCargando(false);
      }
    }

    cargarPerfil();
  }, []);

  useEffect(() => {
    if (!fotoSeleccionada) {
      setVistaPrevia("");
      return;
    }

    const url = URL.createObjectURL(fotoSeleccionada);
    setVistaPrevia(url);

    return () => URL.revokeObjectURL(url);
  }, [fotoSeleccionada]);

  function manejarCambio(
    campo: keyof ActualizarMiPerfilRequest,
    valor: string,
  ) {
    setFormulario((actual) => ({
      ...actual,
      [campo]: valor,
    }));
  }

  function manejarSeleccionFoto(evento: ChangeEvent<HTMLInputElement>) {
    const archivo = evento.target.files?.[0];

    setMensajeFoto("");
    setErrorFoto("");

    if (!archivo) return;

    const formatosPermitidos = ["image/jpeg", "image/png", "image/webp"];

    if (!formatosPermitidos.includes(archivo.type)) {
      setFotoSeleccionada(null);
      evento.target.value = "";
      setErrorFoto("Seleccioná una imagen JPG, PNG o WebP.");
      return;
    }

    if (archivo.size > 2 * 1024 * 1024) {
      setFotoSeleccionada(null);
      evento.target.value = "";
      setErrorFoto("La imagen no puede superar los 2 MB.");
      return;
    }

    setFotoSeleccionada(archivo);
  }

  async function subirFoto() {
    if (!fotoSeleccionada) return;

    setSubiendoFoto(true);
    setMensajeFoto("");
    setErrorFoto("");

    try {
      await actualizarMiFoto(fotoSeleccionada);

      // Volvemos a consultar el perfil para obtener la nueva URL firmada.
      const datosActualizados = await obtenerMiPerfil();

      setPerfil(datosActualizados);
      setFotoSeleccionada(null);
      setMensajeFoto("Tu foto de perfil se actualizó correctamente.");
    } catch (err) {
      console.error("Error al actualizar la foto:", err);
      setErrorFoto("No se pudo actualizar la foto. Intentá nuevamente.");
    } finally {
      setSubiendoFoto(false);
    }
  }

  async function guardarCambios(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (!perfil) return;

    setGuardando(true);
    setMensaje("");
    setError("");

    try {
      const datosActualizados = await actualizarMiPerfil(formulario);

      setPerfil(datosActualizados);
      setFormulario({
        primer_nombre: datosActualizados.primer_nombre,
        segundo_nombre: datosActualizados.segundo_nombre,
        primer_apellido: datosActualizados.primer_apellido,
        segundo_apellido: datosActualizados.segundo_apellido,
        telefono: datosActualizados.telefono,
      });

      setMensaje("Tus datos se actualizaron correctamente.");
    } catch (err) {
      console.error("Error al actualizar el perfil:", err);
      setError("No se pudieron guardar los cambios. Intentá nuevamente.");
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return <p className="text-sm text-slate-500">Cargando tu perfil...</p>;
  }

  if (!perfil) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error || "No se encontró información del perfil."}
      </div>
    );
  }

  const nombreCompleto = [
    perfil.primer_nombre,
    perfil.segundo_nombre,
    perfil.primer_apellido,
    perfil.segundo_apellido,
  ]
    .filter(Boolean)
    .join(" ");

  const campos = [
    {
      nombre: "primer_nombre" as const,
      etiqueta: "Primer nombre",
      requerido: true,
    },
    {
      nombre: "segundo_nombre" as const,
      etiqueta: "Segundo nombre",
      requerido: false,
    },
    {
      nombre: "primer_apellido" as const,
      etiqueta: "Primer apellido",
      requerido: true,
    },
    {
      nombre: "segundo_apellido" as const,
      etiqueta: "Segundo apellido",
      requerido: false,
    },
    {
      nombre: "telefono" as const,
      etiqueta: "Teléfono",
      requerido: false,
    },
  ];

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mi perfil</h1>
        <p className="mt-1 text-sm text-slate-500">
          Consultá y actualizá tus datos personales.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-2xl font-bold text-indigo-700">
            {vistaPrevia || perfil.foto_perfil_url ? (
              <img
                src={vistaPrevia || perfil.foto_perfil_url || ""}
                alt="Foto de perfil"
                className="h-full w-full object-cover"
              />
            ) : (
              perfil.primer_nombre.charAt(0).toUpperCase()
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-slate-900">
              {nombreCompleto}
            </h2>
            <p className="text-sm text-slate-500">{perfil.email}</p>
            <p className="mt-1 text-xs font-medium text-indigo-600">
              {perfil.rol}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <label
                htmlFor="foto-perfil"
                className="cursor-pointer rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Seleccionar foto
              </label>

              <input
                id="foto-perfil"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={manejarSeleccionFoto}
                className="hidden"
              />

              <button
                type="button"
                onClick={subirFoto}
                disabled={!fotoSeleccionada || subiendoFoto}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {subiendoFoto ? "Subiendo..." : "Guardar foto"}
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-400">
              JPG, PNG o WebP. Tamaño máximo: 2 MB.
            </p>

            {fotoSeleccionada && (
              <p className="mt-2 text-xs text-slate-600">
                Archivo seleccionado: {fotoSeleccionada.name}
              </p>
            )}

            {mensajeFoto && (
              <p className="mt-3 text-sm text-green-700">{mensajeFoto}</p>
            )}

            {errorFoto && (
              <p className="mt-3 text-sm text-red-600">{errorFoto}</p>
            )}
          </div>
        </div>
      </div>

      <form
        onSubmit={guardarCambios}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Datos personales
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Podés modificar tu información personal.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {campos.map((campo) => (
            <div key={campo.nombre}>
              <label
                htmlFor={campo.nombre}
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                {campo.etiqueta}
              </label>

              <input
                id={campo.nombre}
                type="text"
                value={formulario[campo.nombre] ?? ""}
                onChange={(evento) =>
                  manejarCambio(campo.nombre, evento.target.value)
                }
                required={campo.requerido}
                maxLength={campo.nombre === "telefono" ? 20 : 50}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Correo electrónico
            </label>
            <input
              type="email"
              value={perfil.email}
              readOnly
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Estado de la cuenta
            </label>
            <input
              type="text"
              value={perfil.estado}
              readOnly
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
            />
          </div>
        </div>

        {mensaje && (
          <p className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {mensaje}
          </p>
        )}

        {error && (
          <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={guardando}
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </section>
  );
}
