import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import type { Ticket } from "../../types";

interface RecentActivityFeedProps {
    tickets: Ticket[];
}

const LABEL_ESTADO: Record<string, string> = {
    ABIERTO: "fue abierto",
    EN_PROGRESO: "pasó a en progreso",
    ESCALADO: "fue escalado",
    RESUELTO: "fue resuelto",
    CERRADO: "fue cerrado",
};

const tiempoRelativo = (iso: string) => {
    const diffMs = Date.now() - new Date(iso).getTime();
    const minutos = Math.floor(diffMs / 60000);
    if (minutos < 1) return "hace un momento";
    if (minutos < 60) return `hace ${minutos} min`;
    const horas = Math.floor(minutos / 60);
    if (horas < 24) return `hace ${horas}h`;
    return `hace ${Math.floor(horas / 24)}d`;
};

const RecentActivityFeed = ({ tickets }: RecentActivityFeedProps) => {
    const recientes = [...tickets]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5);

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-surface border border-border rounded-xl p-5"
        >
            <h3 className="text-sm font-medium text-text-primary mb-4 flex items-center gap-2">
                <Clock size={14} className="text-text-secondary" />
                Actividad reciente
            </h3>
            <div className="flex flex-col gap-3">
                {recientes.length === 0 ? (
                    <p className="text-xs text-text-secondary">Sin actividad todavía.</p>
                ) : (
                    recientes.map((t) => (
                        <div key={t.id} className="flex items-start gap-2.5 text-xs">
                            <div className="w-1.5 h-1.5 rounded-full bg-signal mt-1.5 shrink-0" />
                            <p className="text-text-secondary leading-relaxed">
                                <span className="text-text-primary font-medium">{t.titulo}</span>{" "}
                                {LABEL_ESTADO[t.estado] || "se actualizó"} · {tiempoRelativo(t.updatedAt)}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </motion.div>
    );
};

export default RecentActivityFeed;