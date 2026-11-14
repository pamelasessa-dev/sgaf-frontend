/**
 * App.tsx
 *
 * Define las rutas del SGAF.
 * Las páginas pesadas se descargan con React.lazy cuando el usuario entra en ellas.
 * El layout autenticado vive en PanelLayout y comparte el menú de cada rol.
 */

import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { AvisoAccesoGlobal, EstadoCarga } from "./components/ui";
import ErrorBoundary from "./components/ui/ErrorBoundary";

import LoginPage from "./features/auth/LoginPage";
import RegistroPage from "./features/auth/RegistroPage";
import PanelLayout from "./layouts/PanelLayout";
import PaginaNoEncontrada from "./routes/PaginaNoEncontrada";
import RutaProtegida from "./routes/RutaProtegida";

// ============================================
// Perfil
// ============================================

const MiPerfilPage = lazy(() => import("./features/perfil/MiPerfilPage"));

// ============================================
// Páginas de administración
// ============================================

const AdminDashboard = lazy(
  () => import("./features/administracion/AdminDashboard"),
);

const UsuariosPage = lazy(
  () => import("./features/administracion/usuarios/UsuariosPage"),
);

const EstudiantesPage = lazy(
  () => import("./features/administracion/estudiantes/EstudiantesPage"),
);

const EstudianteDetalle = lazy(
  () => import("./features/administracion/estudiantes/EstudianteDetalle"),
);

const EstudianteDashboard = lazy(
  () => import("./features/administracion/estudiantes/EstudianteDashboard"),
);

const ProfesorDashboard = lazy(
  () => import("./features/administracion/profesores/ProfesorDashboard"),
);

const ProfesoresPage = lazy(
  () => import("./features/administracion/profesores/ProfesoresPage"),
);

const ProfesorAulaVirtualPage = lazy(
  () => import("./features/aula-virtual/profesor/ProfesorAulaVirtualPage"),
);

// ============================================
// Páginas académicas
// ============================================

const MateriasPage = lazy(
  () => import("./features/academico/materias/MateriasPage"),
);

const PeriodosPage = lazy(
  () => import("./features/academico/periodos/PeriodosPage"),
);

const AulasPage = lazy(() => import("./features/academico/aulas/AulasPage"));

const GruposPage = lazy(() => import("./features/academico/grupos/GruposPage"));

const HorariosPage = lazy(
  () => import("./features/academico/horarios/HorariosPage"),
);

// ============================================
// Matrículas
// ============================================

const MatriculasPage = lazy(
  () => import("./features/academico/matriculas/MatriculasPage"),
);

// ============================================
// Aula Virtual del estudiante
// ============================================

const EstudianteAulaVirtualPage = lazy(
  () => import("./features/aula-virtual/estudiante/EstudianteAulaVirtualPage"),
);

// ============================================
// Finanzas del estudiante
// ============================================

const EstudianteFinanzasPage = lazy(
  () => import("./features/finanzas/estudiante/EstudianteFinanzasPage"),
);

// ============================================
// Gestión administrativa de pagos
// ============================================

const PagosPage = lazy(
  () => import("./features/finanzas/administracion/PagosPage"),
);

// ============================================
// Recepción
// ============================================

const RecepcionDashboard = lazy(
  () => import("./features/recepcion/RecepcionDashboard"),
);

function App() {
  return (
    <ErrorBoundary>
      <>
        <AvisoAccesoGlobal />

        <Suspense fallback={<EstadoCarga mensaje="Cargando el sistema..." />}>
          <Routes>
            {/* ======================================
                ACCESO PÚBLICO
            ====================================== */}

            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegistroPage />} />

            {/* ======================================
                RUTAS PROTEGIDAS
            ====================================== */}

            <Route element={<RutaProtegida />}>
              <Route element={<PanelLayout />}>
                {/* ======================================
                    PERFIL PERSONAL
                ====================================== */}

                <Route element={<RutaProtegida rolesPermitidos={["ADMIN"]} />}>
                  <Route path="/admin/perfil" element={<MiPerfilPage />} />
                </Route>

                <Route
                  element={
                    <RutaProtegida rolesPermitidos={["RECEPCIONISTA"]} />
                  }
                >
                  <Route path="/recepcion/perfil" element={<MiPerfilPage />} />
                </Route>

                <Route
                  element={<RutaProtegida rolesPermitidos={["PROFESOR"]} />}
                >
                  <Route path="/profesor/perfil" element={<MiPerfilPage />} />
                </Route>

                {/* ======================================
                    ADMINISTRACIÓN
                ====================================== */}

                <Route element={<RutaProtegida rolesPermitidos={["ADMIN"]} />}>
                  <Route path="/admin" element={<AdminDashboard />} />

                  <Route
                    path="/admin/estudiantes"
                    element={<EstudiantesPage />}
                  />

                  <Route
                    path="/admin/estudiantes/:id"
                    element={<EstudianteDetalle />}
                  />

                  <Route
                    path="/admin/profesores"
                    element={<ProfesoresPage />}
                  />

                  {/* Gestión académica */}

                  <Route path="/admin/materias" element={<MateriasPage />} />

                  <Route path="/admin/periodos" element={<PeriodosPage />} />

                  <Route path="/admin/aulas" element={<AulasPage />} />

                  <Route path="/admin/grupos" element={<GruposPage />} />

                  <Route path="/admin/horarios" element={<HorariosPage />} />

                  <Route path="/admin/pagos" element={<PagosPage />} />
                </Route>

                {/* ======================================
                    USUARIOS
                ====================================== */}

                <Route
                  element={
                    <RutaProtegida
                      rolesPermitidos={["ADMIN", "RECEPCIONISTA"]}
                    />
                  }
                >
                  <Route path="/usuarios" element={<UsuariosPage />} />
                </Route>

                {/* ======================================
                    RECEPCIÓN
                ====================================== */}

                <Route
                  element={
                    <RutaProtegida rolesPermitidos={["RECEPCIONISTA"]} />
                  }
                >
                  <Route path="/recepcion" element={<RecepcionDashboard />} />

                  <Route path="/recepcion/pagos" element={<PagosPage />} />
                </Route>

                {/* ======================================
                    PROFESORES
                ====================================== */}

                <Route
                  element={<RutaProtegida rolesPermitidos={["PROFESOR"]} />}
                >
                  <Route path="/profesor" element={<ProfesorDashboard />} />

                  <Route
                    path="/profesor/aula-virtual"
                    element={<ProfesorAulaVirtualPage />}
                  />
                </Route>

                {/* ======================================
                    ESTUDIANTES
                ====================================== */}

                <Route
                  element={<RutaProtegida rolesPermitidos={["ESTUDIANTE"]} />}
                >
                  <Route path="/estudiante" element={<EstudianteDashboard />} />

                  <Route path="/estudiante/perfil" element={<MiPerfilPage />} />

                  <Route
                    path="/estudiante/matriculas"
                    element={<MatriculasPage />}
                  />

                  <Route
                    path="/estudiante/aula-virtual"
                    element={<EstudianteAulaVirtualPage />}
                  />

                  <Route
                    path="/estudiante/finanzas"
                    element={<EstudianteFinanzasPage />}
                  />
                </Route>
              </Route>
            </Route>

            {/* ======================================
                RUTAS GENERALES
            ====================================== */}

            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="*" element={<PaginaNoEncontrada />} />
          </Routes>
        </Suspense>
      </>
    </ErrorBoundary>
  );
}

export default App;