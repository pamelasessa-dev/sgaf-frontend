/**
 * matricula.ts
 *
 * Define los tipos de datos de matrículas y las estructuras
 * financieras relacionadas con las obligaciones y los pagos.
 */

// Los valores Decimal del backend pueden llegar como string o number.
export type ValorMonetario = string | number;

// Estados de las matrículas.
export type EstadoMatricula = "PENDIENTE" | "ACTIVA" | "CANCELADA";

// Estados de los grupos.
export type EstadoGrupoMatricula = "ABIERTO" | "CERRADO" | "FINALIZADO";

// Estados de las obligaciones financieras.
export type EstadoObligacion = "PENDIENTE" | "PAGADA" | "VENCIDA" | "CANCELADA";

// Conceptos de las obligaciones financieras.
export type ConceptoObligacion = "INSCRIPCION" | "MENSUALIDAD" | "OTRO";

// Estados de los pagos.
export type EstadoPago = "PENDIENTE" | "APROBADO" | "RECHAZADO";

// Métodos de pago permitidos por el backend.
export type MetodoPago = "EFECTIVO" | "TRANSFERENCIA" | "PASARELA";

// Información de la materia asociada al grupo.
export interface MateriaMatricula {
  id_materia: number;
  nombre: string;
  descripcion: string | null;
  creditos: number;
  costos_inscripcion: ValorMonetario;
  costo_mensual: ValorMonetario;
  estado: string;
}

// Información del período académico.
export interface PeriodoMatricula {
  id_periodo: number;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  limite_creditos: number;
  estado: string;
}

// Datos básicos del usuario profesor.
export interface UsuarioProfesorMatricula {
  id_usuario: number;
  primer_nombre: string;
  segundo_nombre?: string | null;
  primer_apellido: string;
  segundo_apellido?: string | null;
  email: string;
}

// Información del profesor del grupo.
export interface ProfesorMatricula {
  id_profesor: number;
  id_usuario: number;
  especialidad: string;
  fecha_contratacion: string;
  usuario: UsuarioProfesorMatricula;
}

// Información del aula asignada.
export interface AulaMatricula {
  id_aula: number;
  nombre: string;
  capacidad: number;
  ubicacion: string;
  tipo: string;
  estado: string;
}

// Horario asociado al grupo.
export interface HorarioMatricula {
  id_horario: number;
  id_grupo: number;
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
}

// Información completa del grupo académico.
export interface GrupoMatricula {
  id_grupo: number;
  id_materia: number;
  id_periodo: number;
  id_profesor: number;
  id_aula: number;
  nombre: string;
  cupo_maximo: number;
  estado: EstadoGrupoMatricula;
  materia: MateriaMatricula;
  periodo: PeriodoMatricula;
  profesor: ProfesorMatricula;
  aula: AulaMatricula;
  horarios?: HorarioMatricula[];
}

// Información de los pagos asociados a una obligación.
export interface PagoMatricula {
  id_pago: number;
  id_obligacion: number;
  id_usuario_verificador: number | null;
  monto: ValorMonetario;
  fecha_pago: string;
  metodo: MetodoPago;
  estado: EstadoPago;
  fecha_validacion: string | null;
  observacion: string | null;
  id_mockpay: string | null;
  checkout_url: string | null;
}

// Obligación financiera.
export interface ObligacionMatricula {
  id_obligacion: number;
  id_estudiante: number;
  id_matricula: number | null;
  concepto: ConceptoObligacion;
  monto: ValorMonetario;
  fecha_emision: string;
  fecha_vencimiento: string;
  estado: EstadoObligacion;
  pagos: PagoMatricula[];
}

// Matrícula del estudiante autenticado.
export interface Matricula {
  id_matricula: number;
  id_estudiante: number;
  id_grupo: number;
  fecha_matricula: string;
  estado: EstadoMatricula;
  grupo: GrupoMatricula;
  obligaciones: ObligacionMatricula[];
}

// Datos necesarios para solicitar una matrícula.
export interface CrearMatriculaDto {
  id_grupo: number;
}

// Respuesta del backend al solicitar una matrícula.
export interface CrearMatriculaResponse {
  mensaje: string;
  matricula: Matricula;
  obligacion: ObligacionMatricula;
}

// Respuesta del backend al activar una matrícula.
export interface ActivarMatriculaResponse {
  mensaje: string;
  matricula: Matricula;
}

// Datos necesarios para registrar un pago.
export interface CrearPagoDto {
  id_obligacion: number;
  monto: number;
  metodo: MetodoPago;
}

// Datos necesarios para rechazar un pago.
export interface RechazarPagoDto {
  observacion: string;
}

// Información de una obligación con sus datos relacionados.
// El backend puede incluir estudiante, matrícula y pagos.
export interface ObligacionFinanciera extends ObligacionMatricula {
  estudiante?: {
    id_estudiante: number;
    usuario?: {
      id_usuario: number;
      primer_nombre: string;
      primer_apellido: string;
      email: string;
    };
  };
  matricula?: {
    id_matricula: number;
    grupo?: GrupoMatricula;
  } | null;
}

// Pago con información de su obligación y verificador.
export interface PagoFinanciero extends PagoMatricula {
  obligacion?: ObligacionFinanciera;
  usuario_verificador?: {
    id_usuario: number;
    primer_nombre: string;
    primer_apellido: string;
    email: string;
  } | null;
}