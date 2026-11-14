//Este archivo es el punto de entrada de React.
//StrictMode: Ayuda a detectar problemas durante el desarrollo.
//createRoot: Crea un contenedor(el punto donde react pueda renderizar) para renderizar la aplicación.
//./index.css: Importa los estilos globales de la aplicación.
//./App.tsx: Importa el componente principal de la aplicación.
//<App /> : Renderiza el componente App dentro del contenedor creado por createRoot.
// Es decir muestra nuestros componentes
// Una observación: el signo ! en getElementById('root')!
// es una afirmación de TypeScript de que esperamos encontrar ese elemento HTML.

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";

import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);

/**BrowserRouter: habilita la navegación mediante URLs.
 * App: contiene nuestras páginas y rutas.
 * StrictMode: ayuda a detectar problemas durante el desarrollo.
 * Routes: contiene todas las rutas de nuestra aplicación.
 * Route: representa una dirección específica y el componente que debe mostrarse.
 */
