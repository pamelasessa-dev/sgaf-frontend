import { z } from "zod";

export const profesorSchema = z.object({
  primer_nombre: z.string().min(1, "El primer nombre es obligatorio"),
  segundo_nombre: z.string().optional(),
  primer_apellido: z.string().min(1, "El primer apellido es obligatorio"),
  segundo_apellido: z.string().optional(),
  email: z.string().email("Introduce un correo electrónico válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  especialidad: z.string().min(1, "La especialidad es obligatoria"),
  fecha_contratacion: z
    .string()
    .min(1, "La fecha de contratación es obligatoria"),
});
export const profesorEditarSchema = profesorSchema.omit({
  password: true,
});
export type ProfesorFormulario = z.infer<typeof profesorSchema>;

export type ProfesorEditarFormulario = z.infer<typeof profesorEditarSchema>;


/*
- z.string(): indica que el campo debe ser texto.
- .min(1): evita que el campo quede vacío.
- .email(): comprueba que el correo tenga un formato válido.
- .optional(): permite dejar el segundo nombre y segundo apellido vacíos.
- .infer: genera automáticamente un tipo TypeScript a partir del esquema.
- Para crear un profesor necesitamos contraseña.
- Para editarlo no necesitamos volver a solicitarla.
- omit() permite reutilizar las validaciones existentes y excluir ese campo.
*/