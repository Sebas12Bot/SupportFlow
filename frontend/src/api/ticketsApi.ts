import axiosClient from "./axiosClient";
import type { Ticket, HistorialEstado, Estado, Prioridad } from "../types";

export const listarTickets = async (): Promise<Ticket[]> => {
    const { data } = await axiosClient.get<Ticket[]>("/api/tickets");
    return data;
};

export const ticketsSinAsignar = async (): Promise<Ticket[]> => {
    const { data } = await axiosClient.get<Ticket[]>("/api/tickets/sin-asignar");
    return data;
};

export const obtenerTicket = async (id: number): Promise<Ticket> => {
    const { data } = await axiosClient.get<Ticket>(`/api/tickets/${id}`);
    return data;
};

export const obtenerHistorial = async (id: number): Promise<HistorialEstado[]> => {
    const { data } = await axiosClient.get<HistorialEstado[]>(`/api/tickets/${id}/historial`);
    return data;
};

export const crearTicket = async (
    titulo: string,
    descripcion: string,
    prioridad: Prioridad
): Promise<Ticket> => {
    const { data } = await axiosClient.post<Ticket>("/api/tickets", { titulo, descripcion, prioridad });
    return data;
};

export const cambiarEstado = async (
    id: number,
    nuevoEstado: Estado,
    version: number
): Promise<Ticket> => {
    const { data } = await axiosClient.patch<Ticket>(`/api/tickets/${id}/estado`, { nuevoEstado, version });
    return data;
};

export const asignarTicket = async (id: number, usuarioAsignadoId: number): Promise<Ticket> => {
    const { data } = await axiosClient.patch<Ticket>(`/api/tickets/${id}/asignar`, { usuarioAsignadoId });
    return data;
};