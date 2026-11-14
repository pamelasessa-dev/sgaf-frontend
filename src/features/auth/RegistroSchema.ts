import { z } from "zod";

export const RegistroSchema = z.object({
  primer_nombre: z.string().trim().min(1, "El primer nombre es obligatorio."),
  segundo_nombre: z.string().optional(),
  primer_apellido: z
    .string()
    .trim()
    .min(1, "El primer apellido es obligatorio."),
  segundo_apellido: z.string().optional(),
  email: z
    .string()
    .trim()
    .min(1, "El correo electrónico es obligatorio.")
    .email("Ingresá un correo electrónico válido."),
  password: z.string().min(1, "La contraseña es obligatoria."),
  telefono: z.string().optional(),
  fecha_nacimiento: z.string().min(1, "La fecha de nacimiento es obligatoria."),
  direccion: z.string().optional(),
  tutor_nombre: z.string().trim().min(1, "El nombre del tutor es obligatorio."),
  tutor_apellido: z
    .string()
    .trim()
    .min(1, "El apellido del tutor es obligatorio."),
  tutor_parentesco: z.string().trim().min(1, "El parentesco es obligatorio."),
  tutor_telefono: z
    .string()
    .trim()
    .min(1, "El teléfono del tutor es obligatorio."),
  tutor_email: z
    .union([
      z.string().trim().email("Ingresá un correo válido."),
      z.literal(""),
    ])
    .optional(),
  tutor_direccion: z.string().optional(),
});

export type RegistroFormData = z.infer<typeof RegistroSchema>;
