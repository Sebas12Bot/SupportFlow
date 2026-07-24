import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Inbox, Ticket as TicketIcon, CheckCircle2, Clock3, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import Navbar from "../components/layout/Navbar";
import Button from "../components/ui/Button";
import ErrorState from "../components/ui/ErrorState";
import MetricCard from "../components/dashboard/MetricCard";
import WeeklyActivityChart from "../components/dashboard/WeeklyActivityChart";
import RecentActivityFeed from "../components/dashboard/RecentActivityFeed";
import SystemStatusPanel from "../components/dashboard/SystemStatusPanel";
import TicketCard from "../components/dashboard/TicketCard";
import { useAuth } from "../hooks/useAuth";
import * as ticketsApi from "../api/ticketsApi";
import { calcularMetricas } from "../utils/metrics";
import type { Ticket } from "../types";

const DashboardUsuarioPage = () => {
    const { usuario } = useAuth();
    const navigate = useNavigate();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(false);

    const cargarTickets = async () => {
        setError(false);
        setCargando(true);
        try {
            const todos = await ticketsApi.listarTickets();
            setTickets(todos.filter((t) => t.usuarioReporta.id === usuario?.id));
        } catch (err) {
            if (isAxiosError(err) && err.response?.status === 401) {
                // No mostrar ErrorState: el interceptor global maneja la sesión expirada
            } else {
                setError(true);
                toast.error("No se pudieron cargar tus tickets");
            }
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await cargarTickets();
        };
        fetchData();
    }, [usuario?.id]);

    const metricas = calcularMetricas(tickets);

    return (
        <div className="min-h-screen bg-bg-deep">
            <Navbar />

            <main className="max-w-6xl mx-auto px-6 py-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="font-display font-semibold text-2xl text-text-primary mb-1">
                            Mis tickets
                        </h1>
                        <p className="text-text-secondary text-sm">Incidencias que has reportado</p>
                    </div>
                    <Button onClick={() => navigate("/crear-ticket")}>
                        <Plus size={16} />
                        Nuevo ticket
                    </Button>
                </div>

                {error ? (
                    <ErrorState tipo="red" onReintentar={cargarTickets} />
                ) : (
                    <>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <MetricCard label="Activos" valor={String(metricas.abiertos)} icon={TicketIcon} />
                            <MetricCard
                                label="Resueltos (7d)"
                                valor={String(metricas.resueltosSemana)}
                                icon={CheckCircle2}
                                delay={0.05}
                            />
                            <MetricCard
                                label="Tiempo prom."
                                valor={
                                    metricas.tiempoPromedioHoras !== null
                                        ? `${metricas.tiempoPromedioHoras.toFixed(1)}h`
                                        : "—"
                                }
                                icon={Clock3}
                                delay={0.1}
                            />
                            <MetricCard
                                label="Creados (7d)"
                                valor={String(metricas.creadosSemana)}
                                icon={TrendingUp}
                                delay={0.15}
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
                            <div className="lg:col-span-2">
                                <WeeklyActivityChart datos={metricas.datosSemanales} />
                            </div>
                            <SystemStatusPanel />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                {cargando ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="h-32 rounded-xl bg-surface animate-pulse" />
                                        ))}
                                    </div>
                                ) : tickets.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex flex-col items-center justify-center py-20 text-center bg-surface border border-border rounded-xl"
                                    >
                                        <Inbox size={32} className="text-text-secondary mb-4" />
                                        <p className="text-text-primary font-medium mb-1">Aún no tienes tickets</p>
                                        <p className="text-text-secondary text-sm mb-6">
                                            Cuando reportes una incidencia, va a aparecer aquí
                                        </p>
                                        <Button onClick={() => navigate("/crear-ticket")}>
                                            <Plus size={16} />
                                            Crear el primero
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <AnimatePresence>
                                            {tickets.map((ticket, i) => (
                                                <TicketCard key={ticket.id} ticket={ticket} index={i} />
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>

                            <RecentActivityFeed tickets={tickets} />
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default DashboardUsuarioPage;