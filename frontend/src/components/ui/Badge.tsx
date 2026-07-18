import { motion } from "framer-motion";
import type { Estado, Prioridad } from "../../types";

const colorEstado: Record<Estado, string> = {
    ABIERTO: "bg-signal/15 text-signal border-signal/30",
    EN_PROGRESO: "bg-progress/15 text-progress border-progress/30",
    ESCALADO: "bg-critical/15 text-critical border-critical/30",
    RESUELTO: "bg-resolved/15 text-resolved border-resolved/30",
    CERRADO: "bg-closed/15 text-closed border-closed/30",
};

const labelEstado: Record<Estado, string> = {
    ABIERTO: "Abierto",
    EN_PROGRESO: "En progreso",
    ESCALADO: "Escalado",
    RESUELTO: "Resuelto",
    CERRADO: "Cerrado",
};

const colorPrioridad: Record<Prioridad, string> = {
    BAJA: "text-text-secondary",
    MEDIA: "text-warn",
    ALTA: "text-critical",
    CRITICA: "text-critical",
};

interface EstadoBadgeProps {
    estado: Estado;
}

export const EstadoBadge = ({ estado }: EstadoBadgeProps) => {
    return (
        <motion.span
            key={estado}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border font-body ${colorEstado[estado]}`}
        >
            {labelEstado[estado]}
        </motion.span>
    );
};

interface PrioridadBadgeProps {
    prioridad: Prioridad;
}

export const PrioridadBadge = ({ prioridad }: PrioridadBadgeProps) => {
    const esUrgente = prioridad === "CRITICA" || prioridad === "ALTA";
    return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium font-body ${colorPrioridad[prioridad]}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${esUrgente ? "animate-pulse-glow" : ""} bg-current`} />
            {prioridad.charAt(0) + prioridad.slice(1).toLowerCase()}
        </span>
    );
};