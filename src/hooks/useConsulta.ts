/**
 * useConsulta
 *
 * Encapsula la secuencia cargar → éxito / error / fin de carga.
 * La función `cargar` debe estar memorizada con useCallback;
 * si cambia en cada render, la consulta se repetiría sin parar.
 */

import { useCallback, useEffect, useState } from "react";

import { codigoHttp, extraerMensajeError } from "../lib/erroresHttp";

interface ResultadoConsulta<T> {
  datos: T | null;
  cargando: boolean;
  error: string | null;
  codigo: number | null;
  recargar: () => Promise<void>;
}

export function useConsulta<T>(cargar: () => Promise<T>): ResultadoConsulta<T> {
  const [datos, setDatos] = useState<T | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [codigo, setCodigo] = useState<number | null>(null);

  const recargar = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      setCodigo(null);

      const resultado = await cargar();
      setDatos(resultado);
    } catch (err) {
      setDatos(null);
      setCodigo(codigoHttp(err));
      setError(extraerMensajeError(err));
    } finally {
      setCargando(false);
    }
  }, [cargar]);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  return { datos, cargando, error, codigo, recargar };
}
