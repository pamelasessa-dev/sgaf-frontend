import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ThemePreference = "light" | "dark" | "system";

interface ThemeContextType {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "sgaf-theme";

function obtenerTemaInicial(): ThemePreference {
  const guardado = localStorage.getItem(STORAGE_KEY);

  if (guardado === "light" || guardado === "dark" || guardado === "system") {
    return guardado;
  }

  return "system";
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemePreference>(obtenerTemaInicial);

  useEffect(() => {
    const root = document.documentElement;
    const preferenciaSistema = window.matchMedia(
      "(prefers-color-scheme: dark)",
    );

    const aplicarTema = () => {
      const usarOscuro =
        theme === "dark" || (theme === "system" && preferenciaSistema.matches);

      root.classList.toggle("dark", usarOscuro);
      root.style.colorScheme = usarOscuro ? "dark" : "light";
    };

    aplicarTema();
    localStorage.setItem(STORAGE_KEY, theme);

    if (theme === "system") {
      preferenciaSistema.addEventListener("change", aplicarTema);

      return () => {
        preferenciaSistema.removeEventListener("change", aplicarTema);
      };
    }
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme debe utilizarse dentro de ThemeProvider");
  }

  return context;
}
