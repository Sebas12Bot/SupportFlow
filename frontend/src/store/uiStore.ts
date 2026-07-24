import { create } from "zustand";

interface UIState {
    sesionExpirada: boolean;
    marcarSesionExpirada: () => void;
    ocultarModalSesion: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    sesionExpirada: false,
    marcarSesionExpirada: () => set({ sesionExpirada: true }),
    ocultarModalSesion: () => set({ sesionExpirada: false }),
}));