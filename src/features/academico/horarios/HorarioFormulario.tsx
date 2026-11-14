/**
 * HorarioFormulario.tsx
 *
 * Formulario para registrar horarios académicos.
 */

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { obtenerGrupos } from "../../../services/grupoService";
import { crearHorario } from "../../../services/horarioService";

import type { Grupo } from "../../../types/grupo";
import type { HorarioFormulario as DatosHorario } from "./horarioSchema";

import { horarioSchema } from "./horarioSchema";
import { z } from "zod";

interface HorarioFormularioProps {
  onHorarioCreado: () => void | Promise<void>;
}

// Días disponibles para programar clases.
const DIAS_SEMANA = [
  { valor: "LUNES", etiqueta: "Lunes" },
  { valor: "MARTES", etiqueta: "Martes" },
  { valor: "MIERCOLES", etiqueta: "Miércoles" },
  { valor: "JUEVES", etiqueta: "Jueves" },
  { valor: "VIERNES", etiqueta: "Viernes" },
  { valor: "SABADO", etiqueta: "Sábado" },
  { valor: "DOMINGO", etiqueta: "Domingo" },
];

export default function HorarioFormulario({
  onHorarioCreado,
}: HorarioFormularioProps) {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [cargandoGrupos, setCargandoGrupos] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");
  const [errorApi, setErrorApi] = useState("");
  const [guardando, setGuardando] = useState(false);

  // Configuración y validación del formulario.
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof horarioSchema>, unknown, DatosHorario>({
    resolver: zodResolver(horarioSchema),
    defaultValues: {
      id_grupo: 0,
      dia_semana: "LUNES",
      hora_inicio: "08:00",
      hora_fin: "10:00",
    },
  });

  // Carga los grupos disponibles desde el backend.
  useEffect(() => {
    let componenteActivo = true;

    async function cargarGrupos() {
      try {
        setCargandoGrupos(true);
        setErrorCarga("");

        const datos = await obtenerGrupos();

        if (componenteActivo) {
          setGrupos(datos);
        }
      } catch (error) {
        console.error("Error al cargar grupos:", error);

        if (componenteActivo) {
          setErrorCarga("No fue posible cargar los grupos académicos.");
        }
      } finally {
        if (componenteActivo) {
          setCargandoGrupos(false);
        }
      }
    }

    void cargarGrupos();

    return () => {
      componenteActivo = false;
    };
  }, []);

  // Registra el horario en el backend.
  async function manejarRegistro(datos: DatosHorario) {
    try {
      setGuardando(true);
      setErrorApi("");

      await crearHorario(datos);

      await onHorarioCreado();
    } catch (error: unknown) {
      console.error("Error al registrar horario:", error);

      const errorApi = error as {
        response?: {
          data?: {
            message?: string | string[];
          };
        };
      };

      const mensaje = errorApi.response?.data?.message;

      setErrorApi(
        Array.isArray(mensaje)
          ? mensaje.join(", ")
          : mensaje || "No fue posible registrar el horario.",
      );
    } finally {
      setGuardando(false);
    }
  }

  // Devuelve el nombre del profesor asociado al grupo.
  function nombreProfesor(grupo: Grupo): string {
    const usuario = grupo.profesor?.usuario;

    if (!usuario) {
      return `Profesor #${grupo.id_profesor}`;
    }

    return [
      usuario.primer_nombre,
      usuario.segundo_nombre,
      usuario.primer_apellido,
      usuario.segundo_apellido,
    ]
      .filter(Boolean)
      .join(" ");
  }

  return (
    <form
      onSubmit={handleSubmit(manejarRegistro)}
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
    >
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Datos del horario
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Selecciona el grupo y establece el día y el rango horario.
        </p>
      </div>

      {errorApi && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorApi}
        </div>
      )}

      {errorCarga && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p>{errorCarga}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-2 font-semibold underline"
          >
            Recargar página
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Grupo académico */}
        <div className="md:col-span-2">
          <label
            htmlFor="id_grupo"
            className="mb-1.5 block text-sm font-semibold text-slate-700"
          >
            Grupo académico *
          </label>

          <select
            id="id_grupo"
            {...register("id_grupo", { valueAsNumber: true })}
            disabled={cargandoGrupos || grupos.length === 0}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 disabled:opacity-60"
          >
            <option value={0}>
              {cargandoGrupos
                ? "Cargando grupos..."
                : grupos.length === 0
                  ? "No hay grupos registrados"
                  : "Selecciona un grupo"}
            </option>

            {grupos.map((grupo) => (
              <option key={grupo.id_grupo} value={grupo.id_grupo}>
                {grupo.nombre} —{" "}
                {grupo.materia?.nombre ?? `Materia #${grupo.id_materia}`} —{" "}
                {nombreProfesor(grupo)}
              </option>
            ))}
          </select>

          {errors.id_grupo && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.id_grupo.message}
            </p>
          )}
        </div>

        {/* Día de la semana */}
        <div>
          <label
            htmlFor="dia_semana"
            className="mb-1.5 block text-sm font-semibold text-slate-700"
          >
            Día de la semana *
          </label>

          <select
            id="dia_semana"
            {...register("dia_semana")}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          >
            {DIAS_SEMANA.map((dia) => (
              <option key={dia.valor} value={dia.valor}>
                {dia.etiqueta}
              </option>
            ))}
          </select>

          {errors.dia_semana && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.dia_semana.message}
            </p>
          )}
        </div>

        {/* Hora de inicio */}
        <div>
          <label
            htmlFor="hora_inicio"
            className="mb-1.5 block text-sm font-semibold text-slate-700"
          >
            Hora de inicio *
          </label>

          <input
            id="hora_inicio"
            type="time"
            {...register("hora_inicio")}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          />

          {errors.hora_inicio && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.hora_inicio.message}
            </p>
          )}
        </div>

        {/* Hora de finalización */}
        <div>
          <label
            htmlFor="hora_fin"
            className="mb-1.5 block text-sm font-semibold text-slate-700"
          >
            Hora de finalización *
          </label>

          <input
            id="hora_fin"
            type="time"
            {...register("hora_fin")}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          />

          {errors.hora_fin && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.hora_fin.message}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
        <p className="font-semibold">Importante</p>
        <p className="mt-1">
          La hora de finalización debe ser posterior a la hora de inicio. El
          sistema también verificará las restricciones de horarios del grupo.
        </p>
      </div>

      <div className="flex justify-end border-t border-slate-100 pt-5">
        <button
          type="submit"
          disabled={guardando || cargandoGrupos || grupos.length === 0}
          className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {guardando ? "Registrando..." : "Registrar horario"}
        </button>
      </div>
    </form>
  );
}
