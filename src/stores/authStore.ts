import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Usuario } from '../types/auth';

interface AuthState {
  token: string | null;
  usuario: Usuario | null;
  isAuthenticated: boolean;

  login: (token: string, usuario: Usuario) => void;
  actualizarUsuario: (usuario: Usuario) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      isAuthenticated: false,

      login: (token, usuario) =>
        set({
          token,
          usuario,
          isAuthenticated: true,
        }),

      actualizarUsuario: (usuario) =>
        set({ usuario }),

      logout: () =>
        set({
          token: null,
          usuario: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'sgaf-auth-storage',
    },
  ),
);




//qué es zustand? 
// Es una librería para manejar el estado de la aplicación.
// Permite crear un "store" que contiene el estado y las funciones para modificarlo. 
// En este caso, se está creando un store para manejar la autenticación del usuario.
//Zustand es una pequeña memoria central de nuestra aplicación.
//En lugar de que cada componente tenga que guardar su propia copia del usuario,
//  todos pueden consultar la misma información.

/*

- AuthState: define qué información y funciones tendrá nuestra autenticación.
- token: guarda el JWT que devuelve NestJS.
- usuario: guarda el usuario autenticado y su rol.
- isAuthenticated: indica si existe una sesión activa.
- login(): guarda el token y los datos del usuario.
- actualizarUsuario(): permite actualizar los datos del usuario sin cerrar sesión.
- logout(): limpia la sesión.
- persist: conserva el estado en localStorage, incluso si recargamos la página.

*/
