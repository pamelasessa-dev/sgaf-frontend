/**
 * materiaSchema.ts
 *
 * Define las reglas de validación de los formularios de materias.
 *
 * Las validaciones respetan los DTO del backend:
 * - Créditos enteros y mayores que cero.
 * - Costos no negativos.
 * - Costos con un máximo de dos decimales.
 * - Estados ACTIVA o INACTIVA.
 */

import { z } from "zod";

// Comprueba que un importe tenga como máximo dos decimales.
const validarDosDecimales = (valor: number) =>
  Math.abs(valor * 100 - Math.round(valor * 100)) < 0.000001;

// Esquema para registrar una materia.
export const materiaSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio"),

  descripcion: z.string().trim().min(1, "La descripción es obligatoria"),

  creditos: z.coerce
    .number({
      error: "Ingresa una cantidad válida de créditos",
    })
    .int("Los créditos deben ser un número entero")
    .positive("Los créditos deben ser mayores que cero"),

  costos_inscripcion: z.coerce
    .number({
      error: "Ingresa un costo de inscripción válido",
    })
    .finite("El costo de inscripción debe ser un número válido")
    .min(0, "El costo de inscripción no puede ser negativo")
    .refine(
      validarDosDecimales,
      "El costo de inscripción admite como máximo dos decimales",
    ),

  costo_mensual: z.coerce
    .number({
      error: "Ingresa un costo mensual válido",
    })
    .finite("El costo mensual debe ser un número válido")
    .min(0, "El costo mensual no puede ser negativo")
    .refine(
      validarDosDecimales,
      "El costo mensual admite como máximo dos decimales",
    ),

  estado: z.enum(["ACTIVA", "INACTIVA"]),
});

// Esquema para editar.
// Permite enviar únicamente los campos que se desean modificar.
export const materiaEditarSchema = materiaSchema.partial();

// Tipos TypeScript derivados de los esquemas.
export type MateriaFormulario = z.infer<typeof materiaSchema>;

export type MateriaEditarFormulario = z.infer<typeof materiaEditarSchema>;
