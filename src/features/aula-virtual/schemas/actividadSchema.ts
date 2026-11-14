import { z } from "zod";

// Validaciones del formulario de actividades académicas.
export const actividadSchema = z
  .object({
    titulo: z
      .string()
      .trim()
      .min(2, "El título debe tener al menos 2 caracteres"),

    descripcion: z.string().optional(),

    tipo: z.enum(["TAREA", "PARCIAL", "PROYECTO", "EXAMEN"], {
      error: "Selecciona un tipo de actividad",
    }),

    puntaje_maximo: z.coerce
      .number()
      .min(1, "El puntaje mínimo es 1")
      .refine(
        (valor) => Number.isFinite(valor) && Number(valor.toFixed(2)) === valor,
        "Utiliza como máximo dos decimales",
      ),

    porcentaje_aporte: z.coerce
      .number()
      .min(1, "El aporte mínimo es 1%")
      .max(100, "El aporte máximo es 100%")
      .refine(
        (valor) => Number.isFinite(valor) && Number(valor.toFixed(2)) === valor,
        "Utiliza como máximo dos decimales",
      ),

    fecha_apertura: z.string().min(1, "La fecha de apertura es obligatoria"),

    fecha_cierre: z.string().min(1, "La fecha de cierre es obligatoria"),
  })
  .refine(
    (datos) =>
      new Date(datos.fecha_apertura).getTime() <
      new Date(datos.fecha_cierre).getTime(),
    {
      message: "La fecha de cierre debe ser posterior a la apertura",
      path: ["fecha_cierre"],
    },
  );

// Tipo de datos que entrega el esquema después de validar.
export type DatosActividadFormulario = z.output<typeof actividadSchema>;
