export type Rol = "USUARIO" | "AGENTE";
export type Estado = "ABIERTO" | "EN_PROGRESO" | "ESCALADO" | "RESUELTO" | "CERRADO";
export type Prioridad = "BAJA" | "MEDIA" | "ALTA" | "CRITICA";

export interface Usuario {
    id: number;
    nombre: string;
    email: string;
    rol: Rol;
}

export interface Ticket {
    id: number;
    titulo: string;
    descripcion: string;
    estado: Estado;
    prioridad: Prioridad;
    usuarioReporta: Usuario;
    usuarioAsignado: Usuario | null;
    version: number;
    createdAt: string;
    updatedAt: string;
}

export interface HistorialEstado {
    id: number;
    estadoAnterior: Estado | null;
    estadoNuevo: Estado;
    autorNombre: string;
    fechaCambio: string;
}

export interface AuthResponse {
    token: string;
    usuario: Usuario;
}