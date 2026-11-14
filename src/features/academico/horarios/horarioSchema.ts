/**
 * horarioSchema.ts
 *
 * Define las reglas de validación para los formularios
 * de creación y edición de horarios académicos.
 */

import { z } from "zod";

// Días permitidos por el backend.
const diasSemana = [
  "LUNES",
  "MARTES",
  "MIERCOLES",
  "JUEVES",
  "VIERNES",
  "SABADO",
  "DOMINGO",
] as const;

// Valida que la hora tenga el formato HH:mm.
const esquemaHora = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "La hora debe tener el formato HH:mm");

// Valida que la hora de finalización sea posterior a la inicial.
function validarRangoHorario(
  datos: {
    hora_inicio?: string;
    hora_fin?: string;
  },
  contexto: z.RefinementCtx,
) {
  if (datos.hora_inicio && datos.hora_fin) {
    if (datos.hora_fin <= datos.hora_inicio) {
      contexto.addIssue({
        code: "custom",
        path: ["hora_fin"],
        message: "La hora de finalización debe ser posterior a la inicial",
      });
    }
  }
}

// Esquema para registrar un horario.
export const horarioSchema = z
  .object({
    id_grupo: z.coerce
      .number()
      .int("El grupo seleccionado no es válido")
      .positive("Debes seleccionar un grupo"),

    dia_semana: z.enum(diasSemana),

    hora_inicio: esquemaHora,

    hora_fin: esquemaHora,
  })
  .superRefine(validarRangoHorario);

// Esquema para editar un horario.
// El grupo no se modifica mediante el PATCH mostrado en Swagger.
export const horarioEditarSchema = z
  .object({
    dia_semana: z.enum(diasSemana).optional(),

    hora_inicio: esquemaHora.optional(),

    hora_fin: esquemaHora.optional(),
  })
  .superRefine(validarRangoHorario);

// Tipos derivados de los esquemas.
export type HorarioFormulario = z.infer<typeof horarioSchema>;

export type HorarioEditarFormulario = z.infer<typeof horarioEditarSchema>;
