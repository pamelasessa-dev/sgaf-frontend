import api from "./api";
import type { LoginRequest, LoginResponse } from "../types/auth";
import type { RegistroFormData } from "../features/auth/RegistroSchema";

export async function login(datos: LoginRequest): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", datos);
  return data;
}

export async function registrarPostulante(
  datos: RegistroFormData,
): Promise<void> {
  const payload = {
    ...datos,
    fecha_nacimiento: `${datos.fecha_nacimiento}T00:00:00.000Z`,
    segundo_nombre: datos.segundo_nombre || undefined,
    segundo_apellido: datos.segundo_apellido || undefined,
    telefono: datos.telefono || undefined,
    direccion: datos.direccion || undefined,
    tutor_email: datos.tutor_email || undefined,
    tutor_direccion: datos.tutor_direccion || undefined,
  };

  await api.post("/auth/registro", payload);
}
