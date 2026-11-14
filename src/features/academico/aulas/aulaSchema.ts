/**
 * aulaSchema.ts
 *
 * Reglas de validación para registrar y editar aulas.
 */

import { z } from "zod";

// Esquema para crear un aula.
export const aulaSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre del aula es obligatorio"),

  capacidad: z.coerce
    .number({ error: "Ingresa una capacidad válida" })
    .int("La capacidad debe ser un número entero")
    .positive("La capacidad debe ser mayor que cero"),

  ubicacion: z.string().trim().min(1, "La ubicación es obligatoria"),

  tipo: z.enum(["FISICA", "VIRTUAL"], {
    error: "Selecciona un tipo de aula válido",
  }),

  estado: z.enum(["DISPONIBLE", "NO_DISPONIBLE"], {
    error: "Selecciona un estado válido",
  }),
});

// Esquema para editar un aula.
export const aulaEditarSchema = aulaSchema.partial();

export type AulaFormulario = z.infer<typeof aulaSchema>;
export type AulaEditarFormulario = z.infer<typeof aulaEditarSchema>;
