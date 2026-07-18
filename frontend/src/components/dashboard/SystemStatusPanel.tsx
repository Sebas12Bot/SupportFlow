import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosClient from "../../api/axiosClient";

type Estado = "verificando" | "online" | "offline";

const SystemStatusPanel = () => {
    const [estado, setEstado] = useState<Estado>("verificando");

    useEffect(() => {
        const verificar = async () => {
            try {
                await axiosClient.get("/api/tickets");
                setEstado("online");
            } catch {
                setEstado("offline");
            }
        };
        verificar();
    }, []);

    const items = [
        { label: "API", estado },
        { label: "Backend", estado },
        { label: "Base de datos", estado },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="bg-surface border border-border rounded-xl p-5"
        >
            <h3 className="text-sm font-medium text-text-primary mb-4">Estado del sistema</h3>
            <div className="flex flex-col gap-2.5">
                {items.map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-xs">
                        <span className="text-text-secondary">{item.label}</span>
                        <div className="flex items-center gap-1.5">
                            <span
                                className={`w-1.5 h-1.5 rounded-full ${item.estado === "online"
                                        ? "bg-resolved animate-pulse-glow"
                                        : item.estado === "offline"
                                            ? "bg-critical"
                                            : "bg-text-secondary"
                                    }`}
                            />
                            <span className="text-text-primary capitalize">
                                {item.estado === "verificando" ? "Verificando..." : item.estado}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default SystemStatusPanel;