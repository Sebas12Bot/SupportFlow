import type { Ticket } from "../types";

export interface Metricas {
    abiertos: number;
    resueltosSemana: number;
    tiempoPromedioHoras: number | null;
    creadosSemana: number;
    datosSemanales: { dia: string; creados: number }[];
}

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export const calcularMetricas = (tickets: Ticket[]): Metricas => {
    const ahora = new Date();
    const hace7Dias = new Date(ahora);
    hace7Dias.setDate(ahora.getDate() - 6);
    hace7Dias.setHours(0, 0, 0, 0);

    const abiertos = tickets.filter((t) =>
        ["ABIERTO", "EN_PROGRESO", "ESCALADO"].includes(t.estado)
    ).length;

    const resueltosSemana = tickets.filter(
        (t) =>
            (t.estado === "RESUELTO" || t.estado === "CERRADO") &&
            new Date(t.updatedAt) >= hace7Dias
    ).length;

    const creadosSemana = tickets.filter((t) => new Date(t.createdAt) >= hace7Dias).length;

    const resueltos = tickets.filter((t) => t.estado === "RESUELTO" || t.estado === "CERRADO");
    const tiempoPromedioHoras =
        resueltos.length > 0
            ? resueltos.reduce((acc, t) => {
                const horas =
                    (new Date(t.updatedAt).getTime() - new Date(t.createdAt).getTime()) / 3600000;
                return acc + horas;
            }, 0) / resueltos.length
            : null;

    const datosSemanales = Array.from({ length: 7 }, (_, i) => {
        const dia = new Date(hace7Dias);
        dia.setDate(hace7Dias.getDate() + i);
        const siguienteDia = new Date(dia);
        siguienteDia.setDate(dia.getDate() + 1);

        const creados = tickets.filter((t) => {
            const fecha = new Date(t.createdAt);
            return fecha >= dia && fecha < siguienteDia;
        }).length;

        return { dia: DIAS[dia.getDay()], creados };
    });

    return { abiertos, resueltosSemana, tiempoPromedioHoras, creadosSemana, datosSemanales };
};