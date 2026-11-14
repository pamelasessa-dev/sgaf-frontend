import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  ocurrioError: boolean;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    ocurrioError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { ocurrioError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Error inesperado en la interfaz SGAF:", error, info);
  }

  render() {
    if (this.state.ocurrioError) {
      return (
        <main className="flex min-h-[60vh] items-center justify-center p-6">
          <section
            className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm"
            role="alert"
          >
            <h1 className="text-xl font-bold text-slate-800">
              Ocurrió un error inesperado
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              No pudimos mostrar esta sección del sistema. Podés intentar
              nuevamente o volver al inicio de sesión.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => this.setState({ ocurrioError: false })}
                className="rounded-xl bg-[#279EAA] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#218A95]"
              >
                Intentar nuevamente
              </button>

              <button
                type="button"
                onClick={() => {
                  window.location.href = "/login";
                }}
                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Ir al inicio de sesión
              </button>
            </div>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
