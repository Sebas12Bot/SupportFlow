import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {Inbox, Ticket as TicketIcon, CheckCircle2, Clock3, UserCheck } from "lucide-react";
import { toast } from "react-toastify";
import Navbar from "../components/layout/Navbar";
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

const DashboardAgentePage = () => {
    const { usuario } = useAuth();
    const [sinAsignar, setSinAsignar] = useState<Ticket[]>([]);
    const [misAsignados, setMisAsignados] = useState<Ticket[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(false);

    const cargarDatos = async () => {
        setError(false);
        setCargando(true);
        try {
            const [sinAsignarData, todos] = await Promise.all([
                ticketsApi.ticketsSinAsignar(),
                ticketsApi.listarTickets(),
            ]);
            setSinAsignar(sinAsignarData);
            setMisAsignados(todos.filter((t) => t.usuarioAsignado?.id === usuario?.id));
        } catch {
            setError(true);
            toast.error("No se pudieron cargar los tickets");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await cargarDatos();
        };
        fetchData();
    }, [usuario?.id]);


    const metricas = calcularMetricas([...sinAsignar, ...misAsignados]);

    return (
        <div className="min-h-screen bg-bg-deep">
            <Navbar />

            <main className="max-w-6xl mx-auto px-6 py-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="font-display font-semibold text-2xl text-text-primary mb-1">
                            Dashboard de agente
                        </h1>
                        <p className="text-text-secondary text-sm">
                            Gestiona incidencias sin asignar y las que tienes a tu cargo
                        </p>
                    </div>
                </div>

                {error ? (
                    <ErrorState tipo="red" onReintentar={cargarDatos} />
                ) : (
                    <>
                        {/* Métricas */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <MetricCard label="Sin asignar" valor={String(sinAsignar.length)} icon={TicketIcon} />
                            <MetricCard
                                label="Asignados"
                                valor={String(misAsignados.length)}
                                icon={UserCheck}
                                delay={0.05}
                            />
                            <MetricCard
                                label="Resueltos (7d)"
                                valor={String(metricas.resueltosSemana)}
                                icon={CheckCircle2}
                                delay={0.1}
                            />
                            <MetricCard
                                label="Tiempo prom."
                                valor={
                                    metricas.tiempoPromedioHoras !== null
                                        ? `${metricas.tiempoPromedioHoras.toFixed(1)}h`
                                        : "—"
                                }
                                icon={Clock3}
                                delay={0.15}
                            />
                        </div>

                        {/* Paneles */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
                            <div className="lg:col-span-2">
                                <WeeklyActivityChart datos={metricas.datosSemanales} />
                            </div>
                            <SystemStatusPanel />
                        </div>

                        {/* Tickets */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                {cargando ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="h-32 rounded-xl bg-surface animate-pulse" />
                                        ))}
                                    </div>
                                ) : sinAsignar.length + misAsignados.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex flex-col items-center justify-center py-20 text-center bg-surface border border-border rounded-xl"
                                    >
                                        <Inbox size={32} className="text-text-secondary mb-4" />
                                        <p className="text-text-primary font-medium mb-1">
                                            No hay tickets disponibles
                                        </p>
                                        <p className="text-text-secondary text-sm mb-6">
                                            Todo está cubierto por ahora
                                        </p>
                                    </motion.div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <AnimatePresence>
                                            {[...sinAsignar, ...misAsignados].map((ticket, i) => (
                                                <TicketCard key={ticket.id} ticket={ticket} index={i} />
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>

                            <RecentActivityFeed tickets={[...sinAsignar, ...misAsignados]} />
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default DashboardAgentePage;
