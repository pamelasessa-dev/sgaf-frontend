/**
 * Aviso visible cuando el interceptor recibe un HTTP 403.
 * Se monta una sola vez en App para no depender de cada página.
 */

import { AccesoDenegado } from "./AccesoDenegado";
import { useAccesoStore } from "../../stores/accesoStore";
import { useAuthStore } from "../../stores/authStore";
import { rutasPorRol } from "../../routes/rutasPorRol";

export function AvisoAccesoGlobal() {
  const mensaje = useAccesoStore((state) => state.mensaje);
  const limpiar = useAccesoStore((state) => state.limpiar);
  const usuario = useAuthStore((state) => state.usuario);

  if (!mensaje) return null;

  const volverA = usuario ? rutasPorRol[usuario.rol] : undefined;

  return (
    <div className="fixed inset-x-0 top-0 z-50 p-4">
      <div className="mx-auto max-w-3xl shadow-lg">
        <AccesoDenegado
          mensaje={mensaje}
          volverA={volverA}
          onCerrar={limpiar}
        />
      </div>
    </div>
  );
}
