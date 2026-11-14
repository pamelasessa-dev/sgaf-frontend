/**
 * grupoSchema.ts
 *
 * Define las reglas de validación para los formularios
 * de creación y edición de grupos académicos.
 */

import { z } from "zod";

// Esquema de validación para crear un grupo.
export const grupoSchema = z.object({
  // El nombre del grupo es obligatorio.
  nombre: z.string().trim().min(1, "El nombre del grupo es obligatorio"),

  // La materia debe tener un identificador válido.
  id_materia: z.coerce
    .number()
    .int("La materia seleccionada no es válida")
    .positive("Debes seleccionar una materia"),

  // El período debe tener un identificador válido.
  id_periodo: z.coerce
    .number()
    .int("El período seleccionado no es válido")
    .positive("Debes seleccionar un período"),

  // El profesor debe tener un identificador válido.
  id_profesor: z.coerce
    .number()
    .int("El profesor seleccionado no es válido")
    .positive("Debes seleccionar un profesor"),

  // El aula debe tener un identificador válido.
  id_aula: z.coerce
    .number()
    .int("El aula seleccionada no es válida")
    .positive("Debes seleccionar un aula"),

  // El cupo debe ser un número entero positivo.
  cupo_maximo: z.coerce
    .number()
    .int("El cupo debe ser un número entero")
    .positive("El cupo debe ser mayor que cero"),

  // Estados permitidos por el backend.
  estado: z.enum(["ABIERTO", "CERRADO", "FINALIZADO"]),
});

// Esquema de validación para editar un grupo.
// Solo permite modificar los campos que actualiza el backend.
export const grupoEditarSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre del grupo es obligatorio")
    .optional(),

  cupo_maximo: z.coerce
    .number()
    .int("El cupo debe ser un número entero")
    .positive("El cupo debe ser mayor que cero")
    .optional(),

  estado: z.enum(["ABIERTO", "CERRADO", "FINALIZADO"]).optional(),
});

// Tipos derivados de los esquemas.
export type GrupoFormulario = z.infer<typeof grupoSchema>;

export type GrupoEditarFormulario = z.infer<typeof grupoEditarSchema>;
