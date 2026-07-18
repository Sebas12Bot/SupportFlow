import { motion } from "framer-motion";
import { User, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EstadoBadge, PrioridadBadge } from "../ui/Badge";
import type { Ticket } from "../../types";

interface TicketCardProps {
    ticket: Ticket;
    index: number;
    accionExtra?: React.ReactNode;
}

const TicketCard = ({ ticket, index, accionExtra }: TicketCardProps) => {
    const navigate = useNavigate();

    const formatearFecha = (iso: string) =>
        new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25, delay: index * 0.03 }}
            whileHover={{ y: -2 }}
            onClick={() => navigate(`/tickets/${ticket.id}`)}
            className="bg-surface border border-border rounded-xl p-5 cursor-pointer transition-colors hover:border-signal/40 flex flex-col gap-3"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                    <span className="text-xs text-text-secondary font-mono">
                        #TCK-{String(ticket.id).padStart(4, "0")}
                    </span>
                    <span className="text-sm font-medium text-text-primary">{ticket.titulo}</span>
                </div>
                <PrioridadBadge prioridad={ticket.prioridad} />
            </div>

            <div className="flex items-center gap-2">
                <EstadoBadge estado={ticket.estado} />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-3 text-xs text-text-secondary">
                    <span className="flex items-center gap-1">
                        <User size={12} />
                        {ticket.usuarioAsignado?.nombre || "Sin asignar"}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatearFecha(ticket.updatedAt)}
                    </span>
                </div>
                {accionExtra}
            </div>
        </motion.div>
    );
};

export default TicketCard;