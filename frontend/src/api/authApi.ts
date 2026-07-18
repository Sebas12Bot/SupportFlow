import axiosClient from "./axiosClient";
import type { AuthResponse } from "../types";

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await axiosClient.post<AuthResponse>("/api/auth/login", { email, password });
    return data;
};

export const registrar = async (
    nombre: string,
    email: string,
    password: string,
    codigoInvitacion?: string
): Promise<AuthResponse> => {
    const { data } = await axiosClient.post<AuthResponse>("/api/auth/registro", {
        nombre,
        email,
        password,
        codigoInvitacion: codigoInvitacion || undefined,
    });
    return data;
};