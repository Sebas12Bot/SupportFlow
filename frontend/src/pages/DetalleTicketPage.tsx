import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    User,
    UserPlus,
    Clock,
    LayoutDashboard,
} from "lucide-react";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import Navbar from "../components/layout/Navbar";
import Button from "../components/ui/Button";
import { EstadoBadge, PrioridadBadge } from "../components/ui/Badge";
import { useAuth } from "../hooks/useAuth";
import * as ticketsApi from "../api/ticketsApi";
import type { Ticket, HistorialEstado, Estado } from "../types";

const TRANSICIONES_VALIDAS: Record<Estado, Estado[]> = {
    ABIERTO: ["EN_PROGRESO"],
    EN_PROGRESO: ["ESCALADO", "RESUELTO"],
    ESCALADO: ["EN_PROGRESO"],
    RESUELTO: ["CERRADO"],
    CERRADO: [],
};

const LABEL_ESTADO: Record<Estado, string> = {
    ABIERTO: "Abierto",
    EN_PROGRESO: "En progreso",
    ESCALADO: "Escalado",
    RESUELTO: "Resuelto",
    CERRADO: "Cerrado",
};

const DetalleTicketPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { usuario } = useAuth();

    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [historial, setHistorial] = useState<HistorialEstado[]>([]);
    const [cargando, setCargando] = useState(true);
    const [procesando, setProcesando] = useState(false);
    const [nuevoEstado, setNuevoEstado] = useState<Estado | "">("");

    const esAgente = usuario?.rol === "AGENTE";

    const cargarDatos = async () => {
        if (!id) return;

        try {
            const [ticketData, historialData] = await Promise.all([
                ticketsApi.obtenerTicket(Number(id)),
                ticketsApi.obtenerHistorial(Number(id)),
            ]);

            setTicket(ticketData);
            setHistorial(historialData);
        } catch {
            toast.error("No se pudo cargar el ticket");
            navigate(-1);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await cargarDatos();
        };
        fetchData();
    }, [id]);

    const handleCambiarEstado = async () => {
        if (!ticket || !nuevoEstado) return;

        setProcesando(true);

        try {
            await ticketsApi.cambiarEstado(ticket.id, nuevoEstado, ticket.version);

            toast.success(`Estado actualizado a ${LABEL_ESTADO[nuevoEstado]}`);

            setNuevoEstado("");
            await cargarDatos();
        } catch (error) {
            if (isAxiosError(error) && error.response?.status === 409) {
                toast.error("Este ticket fue modificado por otro agente. Recargando...");
                await cargarDatos();
            } else {
                toast.error("No se pudo cambiar el estado");
            }
        } finally {
            setProcesando(false);
        }
    };

    const handleAsignarme = async () => {
        if (!ticket || !usuario) return;

        setProcesando(true);

        try {
            await ticketsApi.asignarTicket(ticket.id, usuario.id);

            toast.success("Te asignaste el ticket");

            await cargarDatos();
        } catch {
            toast.error("No se pudo asignar el ticket");
        } finally {
            setProcesando(false);
        }
    };

    const formatearFecha = (iso: string) =>
        new Date(iso).toLocaleString("es-CO", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });

    if (cargando || !ticket) {
        return (
            <div className="min-h-screen bg-bg-deep">
                <Navbar />
                <div className="max-w-4xl mx-auto px-6 py-10">
                    <div className="h-40 rounded-xl bg-surface animate-pulse" />
                </div>
            </div>
        );
    }

    const transicionesDisponibles = TRANSICIONES_VALIDAS[ticket.estado];

    return (
        <div className="min-h-screen bg-bg-deep">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 py-10">

                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-sm transition-colors"
                    >
                        <ArrowLeft size={15} />
                        Volver
                    </button>

                    <Link
                        to={esAgente ? "/agente" : "/dashboard"}
                        className="flex items-center gap-1.5 text-text-secondary hover:text-signal text-sm transition-colors"
                    >
                        <LayoutDashboard size={15} />
                        Ir al dashboard
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-2 flex flex-col gap-6">

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-surface border border-border rounded-xl p-6"
                        >
                            <span className="text-xs text-text-secondary font-mono">
                                #TCK-{String(ticket.id).padStart(4, "0")}
                            </span>

                            <h1 className="font-display font-semibold text-xl text-text-primary mt-1 mb-4">
                                {ticket.titulo}
                            </h1>

                            <div className="flex items-center gap-4 mb-5">
                                <EstadoBadge estado={ticket.estado} />
                                <PrioridadBadge prioridad={ticket.prioridad} />
                            </div>

                            <p className="text-text-primary text-sm leading-relaxed whitespace-pre-wrap">
                                {ticket.descripcion || "Sin descripción."}
                            </p>
                        </motion.div>

                        {esAgente && transicionesDisponibles.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-surface border border-signal/30 rounded-xl p-6"
                            >
                                <h3 className="text-sm font-medium text-text-primary mb-3">
                                    Cambiar estado
                                </h3>

                                <div className="flex flex-wrap items-center gap-3">
                                    <select
                                        value={nuevoEstado}
                                        onChange={(e) =>
                                            setNuevoEstado(e.target.value as Estado)
                                        }
                                        className="bg-bg-deep border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:border-signal transition-colors"
                                    >
                                        <option value="">Selecciona un estado</option>

                                        {transicionesDisponibles.map((estado) => (
                                            <option key={estado} value={estado}>
                                                {LABEL_ESTADO[estado]}
                                            </option>
                                        ))}
                                    </select>

                                    <Button
                                        onClick={handleCambiarEstado}
                                        disabled={!nuevoEstado}
                                        isLoading={procesando}
                                    >
                                        Confirmar
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        <div>
                            <h3 className="text-sm font-medium text-text-primary mb-4 flex items-center gap-2">
                                <Clock size={15} className="text-text-secondary" />
                                Historial de actividad
                            </h3>

                            <div className="flex flex-col">
                                <AnimatePresence>
                                    {historial.map((h, i) => (
                                        <motion.div
                                            key={h.id}
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                duration: 0.3,
                                                delay: i * 0.05,
                                            }}
                                            className="relative pl-6 pb-6 last:pb-0"
                                        >
                                            {i !== historial.length - 1 && (
                                                <div className="absolute left-[5px] top-3 bottom-0 w-px bg-border" />
                                            )}

                                            <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-signal" />

                                            <span className="text-xs text-text-secondary font-mono">
                                                {formatearFecha(h.fechaCambio)}
                                            </span>

                                            <p className="text-sm text-text-primary mt-0.5">
                                                {h.estadoAnterior ? (
                                                    <>
                                                        Estado cambiado de{" "}
                                                        <span className="text-text-secondary">
                                                            {LABEL_ESTADO[h.estadoAnterior]}
                                                        </span>{" "}
                                                        a{" "}
                                                        <span className="font-medium">
                                                            {LABEL_ESTADO[h.estadoNuevo]}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>Ticket creado</>
                                                )}{" "}
                                                ·{" "}
                                                <span className="text-text-secondary">
                                                    {h.autorNombre}
                                                </span>
                                            </p>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="bg-surface border border-border rounded-xl p-6 h-fit flex flex-col gap-5"
                    >
                        <h3 className="text-xs text-text-secondary uppercase tracking-wide">
                            Metadata
                        </h3>

                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-text-secondary">
                                Reportado por
                            </span>

                            <div className="flex items-center gap-2">
                                <User size={14} className="text-text-secondary" />
                                <span className="text-sm text-text-primary">
                                    {ticket.usuarioReporta.nombre}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-text-secondary">
                                Asignado a
                            </span>

                            {ticket.usuarioAsignado ? (
                                <div className="flex items-center gap-2">
                                    <User size={14} className="text-text-secondary" />
                                    <span className="text-sm text-text-primary">
                                        {ticket.usuarioAsignado.nombre}
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm text-text-secondary">
                                        Sin asignar
                                    </span>

                                    {esAgente && (
                                        <button
                                            onClick={handleAsignarme}
                                            disabled={procesando}
                                            className="flex items-center gap-1 text-signal text-xs hover:underline disabled:opacity-50"
                                        >
                                            <UserPlus size={12} />
                                            Asignarme
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="h-px bg-border" />

                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-text-secondary">
                                Creado
                            </span>

                            <span className="text-sm text-text-primary font-mono">
                                {formatearFecha(ticket.createdAt)}
                            </span>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default DetalleTicketPage;