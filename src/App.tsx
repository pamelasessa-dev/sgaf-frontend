import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { AvisoAccesoGlobal, EstadoCarga } from "./components/ui";
import LoginPage from "./features/auth/LoginPage";
import RegistroPage from "./features/auth/RegistroPage";
import PanelLayout from "./layouts/PanelLayout";
import PaginaNoEncontrada from "./routes/PaginaNoEncontrada";
import RutaProtegida from "./routes/RutaProtegida";

const MiPerfilPage = lazy(() => import("./features/perfil/MiPerfilPage"));
const ProfesorAulaVirtualPage = lazy(
  () => import("./features/aula-virtual/profesor/ProfesorAulaVirtualPage"),
);

const EstudianteAulaVirtualPage = lazy(
  () => import("./features/aula-virtual/estudiante/EstudianteAulaVirtualPage"),
);
const AdminDashboard = lazy(
  () => import("./features/administracion/AdminDashboard"),
);

const UsuariosPage = lazy(
  () => import("./features/administracion/usuarios/UsuariosPage"),
);

const EstudianteDashboard = lazy(
  () => import("./features/administracion/estudiantes/EstudianteDashboard"),
);

const ProfesorInicio = lazy(
  () => import("./features/administracion/profesores/ProfesorInicio"),
);

const RecepcionDashboard = lazy(
  () => import("./features/recepcion/RecepcionDashboard"),
);

function App() {
  return (
    <>
      <AvisoAccesoGlobal />

      <Suspense fallback={<EstadoCarga mensaje="Cargando el sistema..." />}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegistroPage />} />

          {/* Rutas protegidas */}
          <Route element={<RutaProtegida />}>
            <Route element={<PanelLayout />}>
              {/* Administrador */}
              <Route element={<RutaProtegida rolesPermitidos={["ADMIN"]} />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/perfil" element={<MiPerfilPage />} />
              </Route>

              {/* Recepcionista */}
              <Route
                element={<RutaProtegida rolesPermitidos={["RECEPCIONISTA"]} />}
              >
                <Route path="/recepcion" element={<RecepcionDashboard />} />
                <Route path="/recepcion/perfil" element={<MiPerfilPage />} />
              </Route>

              {/* Gestión de usuarios: administrador y recepción */}
              <Route
                element={
                  <RutaProtegida rolesPermitidos={["ADMIN", "RECEPCIONISTA"]} />
                }
              >
                <Route path="/usuarios" element={<UsuariosPage />} />
              </Route>

              {/* Profesor */}
              <Route element={<RutaProtegida rolesPermitidos={["PROFESOR"]} />}>
                <Route path="/profesor" element={<ProfesorInicio />} />
                <Route path="/profesor/perfil" element={<MiPerfilPage />} />
                <Route
                  path="/profesor/aula-virtual"
                  element={<ProfesorAulaVirtualPage />}
                />
              </Route>

              {/* Estudiante */}
              <Route
                element={<RutaProtegida rolesPermitidos={["ESTUDIANTE"]} />}
              >
                <Route path="/estudiante" element={<EstudianteDashboard />} />
                <Route path="/estudiante/perfil" element={<MiPerfilPage />} />
                <Route
                  path="/estudiante/aula-virtual"
                  element={<EstudianteAulaVirtualPage />}
                />
              </Route>
            </Route>
          </Route>

          {/* Rutas generales */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<PaginaNoEncontrada />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
