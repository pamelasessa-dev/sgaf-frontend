/**
 * periodoSchema.ts
 * Define las reglas de validación de los períodos académicos.
 */

import { z } from "zod";

// Comprueba que una fecha tenga formato YYYY-MM-DD y sea válida.
const fechaValida = (valor: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;

  const fecha = new Date(`${valor}T00:00:00`);
  return (
    !Number.isNaN(fecha.getTime()) && fecha.toISOString().slice(0, 10) === valor
  );
};

// Campos compartidos por los formularios.
const periodoBaseSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio"),

  fecha_inicio: z
    .string()
    .min(1, "La fecha de inicio es obligatoria")
    .refine(fechaValida, "Ingresa una fecha de inicio válida"),

  fecha_fin: z
    .string()
    .min(1, "La fecha de finalización es obligatoria")
    .refine(fechaValida, "Ingresa una fecha de finalización válida"),

  limite_creditos: z.coerce
    .number({ error: "Ingresa un límite de créditos válido" })
    .int("El límite debe ser un número entero")
    .positive("El límite debe ser mayor que cero"),

  estado: z.enum(["ACTIVO", "PLANIFICADO", "FINALIZADO"]),
});

// Validación para registrar un período.
export const periodoSchema = periodoBaseSchema.refine(
  (datos) => datos.fecha_fin > datos.fecha_inicio,
  {
    message: "La fecha final debe ser posterior a la fecha inicial",
    path: ["fecha_fin"],
  },
);

// Validación para editar un período.
// Si se envían ambas fechas, se comprueba su orden.
export const periodoEditarSchema = periodoBaseSchema
  .partial()
  .refine(
    (datos) =>
      !datos.fecha_inicio ||
      !datos.fecha_fin ||
      datos.fecha_fin > datos.fecha_inicio,
    {
      message: "La fecha final debe ser posterior a la fecha inicial",
      path: ["fecha_fin"],
    },
  );

export type PeriodoFormulario = z.infer<typeof periodoSchema>;
export type PeriodoEditarFormulario = z.infer<typeof periodoEditarSchema>;
