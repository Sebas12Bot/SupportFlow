import axiosClient from "./axiosClient";
import type { Usuario } from "../types";

export const obtenerPerfil = async (): Promise<Usuario> => {
    const { data } = await axiosClient.get<Usuario>("/api/usuarios/me");
    return data;
};

export const actualizarPerfil = async (nombre: string): Promise<Usuario> => {
    const { data } = await axiosClient.patch<Usuario>("/api/usuarios/me", { nombre });
    return data;
};

export const cambiarPassword = async (passwordActual: string, passwordNueva: string): Promise<void> => {
    await axiosClient.patch("/api/usuarios/me/password", { passwordActual, passwordNueva });
};