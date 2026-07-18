import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, AlertTriangle, AlertCircle, Minus, Flame } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import * as ticketsApi from "../api/ticketsApi";
import type { Prioridad } from "../types";

const OPCIONES_PRIORIDAD: { valor: Prioridad; label: string; icon: typeof Minus; color: string }[] = [
    { valor: "BAJA", label: "Baja", icon: Minus, color: "text-resolved" },
    { valor: "MEDIA", label: "Media", icon: AlertCircle, color: "text-warn" },
    { valor: "ALTA", label: "Alta", icon: AlertTriangle, color: "text-critical" },
    { valor: "CRITICA", label: "Crítica", icon: Flame, color: "text-critical" },
];

const CrearTicketPage = () => {
    const navigate = useNavigate();
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [prioridad, setPrioridad] = useState<Prioridad>("MEDIA");
    const [cargando, setCargando] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCargando(true);
        try {
            const ticket = await ticketsApi.crearTicket(titulo, descripcion, prioridad);
            toast.success("Ticket creado correctamente");
            navigate(`/tickets/${ticket.id}`);
        } catch {
            toast.error("No se pudo crear el ticket");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-deep">
            <Navbar />

            <main className="max-w-2xl mx-auto px-6 py-10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-sm mb-6 transition-colors"
                >
                    <ArrowLeft size={15} />
                    Volver
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <h1 className="font-display font-semibold text-2xl text-text-primary mb-1">
                        Nuevo ticket
                    </h1>
                    <p className="text-text-secondary text-sm mb-8">
                        Describe la incidencia con el mayor detalle posible
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <Input
                            label="Título"
                            type="text"
                            placeholder="Ej: Error al iniciar sesión"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            required
                        />

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs text-text-secondary">Descripción</label>
                            <textarea
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                placeholder="Explica qué pasó, cuándo, y cómo reproducirlo si es posible"
                                rows={5}
                                required
                                className="bg-surface border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-signal transition-colors resize-none font-body"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs text-text-secondary">Prioridad</label>
                            <div className="grid grid-cols-4 gap-2">
                                {OPCIONES_PRIORIDAD.map(({ valor, label, icon: Icon, color }) => (
                                    <button
                                        key={valor}
                                        type="button"
                                        onClick={() => setPrioridad(valor)}
                                        className={`flex flex-col items-center gap-2 py-3 rounded-lg border transition-all ${prioridad === valor
                                                ? "border-signal bg-signal/10"
                                                : "border-border hover:border-text-secondary/40"
                                            }`}
                                    >
                                        <Icon size={16} className={color} />
                                        <span className="text-xs text-text-primary">{label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button type="submit" isLoading={cargando} className="mt-2">
                            Crear ticket
                        </Button>
                    </form>
                </motion.div>
            </main>
        </div>
    );
};

export default CrearTicketPage;