import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      cargando: false,
      login: async ({ nombreUsuario, contrasenia }) => {
        try {
          const response = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ nombreUsuario: nombreUsuario, contrasenia:contrasenia }),
            credentials: "include",
          });
          const data = await response.json();
          if (data.success) {
            set({ user: data.user });
            return data;
          }
        } catch (error) {
          console.log(error);
        }
      },
      setCargando: () => set((state) => ({ cargando: !state.cargando })),
      register: async (
        registoNombre,
        registroEmail,
        registroPassword,
        registroTelefono
      ) => {
        try {
          const response = await fetch(
            "http://localhost:3000/api/usuarios/register",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({
                nombreUsuario: registoNombre,
                correoUsuario: registroEmail,
                contrasenia: registroPassword,
                telefonoUsuario: registroTelefono,
              }),
            }
          );
          const data = await response.json();
          return data;
        } catch (error) {
          console.error(error);
        }
      },
    }),
    { name: "usuario", partialize: (state) => ({ user: state.user }) }
  )
);
