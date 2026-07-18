import { create } from "zustand";
import type { Usuario } from "../types";
import { guardarSesion, obtenerToken, obtenerUsuario, limpiarSesion } from "../utils/storage";

interface AuthState {
    usuario: Usuario | null;
    token: string | null;
    setAuth: (usuario: Usuario, token: string, recordar: boolean) => void;
    logout: () => void;
}

const usuarioGuardado = obtenerUsuario();
const tokenGuardado = obtenerToken();

export const useAuthStore = create<AuthState>((set) => ({
    usuario: usuarioGuardado ? JSON.parse(usuarioGuardado) : null,
    token: tokenGuardado || null,

    setAuth: (usuario, token, recordar) => {
        guardarSesion(token, JSON.stringify(usuario), recordar);
        set({ usuario, token });
    },

    logout: () => {
        limpiarSesion();
        set({ usuario: null, token: null });
    },
}));