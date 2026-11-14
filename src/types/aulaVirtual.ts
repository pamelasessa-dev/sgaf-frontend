/**
 * Tipos del módulo Aula Virtual.
 *
 * Representan las respuestas y solicitudes de los endpoints
 * de actividades académicas y entregas.
 */

export type TipoActividad = "TAREA" | "PARCIAL" | "PROYECTO" | "EXAMEN";

export type EstadoActividad = "BORRADOR" | "ABIERTA" | "CERRADA";

export type EstadoEntrega = "ENTREGADA" | "CALIFICADA";

// Los valores Decimal de Prisma pueden llegar como número o texto.
export type ValorDecimal = number | string;

/**
 * Datos básicos del profesor asociado a un grupo.
 */
export interface ProfesorAulaVirtual {
  id_profesor: number;
  id_usuario: number;
  usuario: {
    id_usuario: number;
    primer_nombre: string;
    primer_apellido: string;
    email: string;
  };
}

/**
 * Datos básicos de la materia asociada a un grupo.
 */
export interface MateriaAulaVirtual {
  id_materia: number;
  nombre: string;
  descripcion?: string | null;
  creditos?: number;
}

/**
 * Datos básicos del período académico.
 */
export interface PeriodoAulaVirtual {
  id_periodo: number;
  nombre: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  estado?: string;
}

/**
 * Grupo académico utilizado en el Aula Virtual.
 */
export interface GrupoAulaVirtual {
  id_grupo: number;
  nombre: string;
  id_profesor: number;
  id_materia: number;
  materia: MateriaAulaVirtual;
  periodo?: PeriodoAulaVirtual;
  profesor?: ProfesorAulaVirtual;
}

/**
 * Actividad académica.
 */
export interface ActividadAcademica {
  id_actividad: number;
  id_grupo: number;
  titulo: string;
  descripcion: string | null;
  tipo: TipoActividad;
  puntaje_maximo: ValorDecimal;
  porcentaje_aporte: ValorDecimal;
  fecha_apertura: string;
  fecha_cierre: string;
  estado: EstadoActividad;
  grupo?: GrupoAulaVirtual;
}

/**
 * Datos necesarios para crear una actividad.
 */
export interface CrearActividadDto {
  id_grupo: number;
  titulo: string;
  descripcion?: string;
  tipo: TipoActividad;
  puntaje_maximo: number;
  porcentaje_aporte: number;
  fecha_apertura: string;
  fecha_cierre: string;
}

/**
 * Datos opcionales para editar una actividad.
 * El backend solamente permite editar actividades BORRADOR.
 */
export type ActualizarActividadDto = Partial<
  Omit<CrearActividadDto, "id_grupo">
>;

/**
 * Datos necesarios para cambiar el estado de una actividad.
 */
export interface CambiarEstadoActividadDto {
  estado: EstadoActividad;
}

/**
 * Datos básicos del estudiante que realizó una entrega.
 */
export interface EstudianteEntrega {
  id_estudiante: number;
  usuario: {
    id_usuario: number;
    primer_nombre: string;
    primer_apellido: string;
    email: string;
  };
}

/**
 * Matrícula asociada a una entrega.
 */
export interface MatriculaEntrega {
  id_matricula: number;
  id_estudiante: number;
  id_grupo?: number;
  estudiante?: EstudianteEntrega;
}

/**
 * Entrega de un estudiante.
 */
export interface EntregaAcademica {
  id_entrega: number;
  id_actividad: number;
  id_matricula: number;
  fecha_entrega: string;
  archivo_url: string | null;
  respuesta_texto: string | null;
  puntaje_obtenido: ValorDecimal | null;
  observacion_docente: string | null;
  estado: EstadoEntrega;
  actividad?: ActividadAcademica;
  matricula?: MatriculaEntrega;
}

/**
 * Datos necesarios para crear una entrega.
 * El estudiante puede enviar texto, URL o ambos.
 */
export interface CrearEntregaDto {
  id_actividad: number;
  archivo_url?: string;
  respuesta_texto?: string;
}

/**
 * Datos necesarios para calificar una entrega.
 */
export interface CalificarEntregaDto {
  puntaje_obtenido: number;
  observacion_docente?: string;
}
