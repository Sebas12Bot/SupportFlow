import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUIStore } from "../../store/uiStore";
import Button from "./Button";

const SessionExpiredModal = () => {
    const { sesionExpirada, ocultarModalSesion } = useUIStore();
    const navigate = useNavigate();

    const handleIniciarSesion = () => {
        ocultarModalSesion();
        navigate("/login");
    };

    return (
        <AnimatePresence>
            {sesionExpirada && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center px-4"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-surface border border-border rounded-xl p-6 max-w-sm w-full"
                    >
                        <div className="w-11 h-11 rounded-lg bg-warn/10 border border-warn/30 flex items-center justify-center mb-4">
                            <AlertCircle size={20} className="text-warn" />
                        </div>
                        <h3 className="text-text-primary font-medium mb-1.5">Tu sesión expiró</h3>
                        <p className="text-text-secondary text-sm mb-6">
                            Por seguridad, cerramos tu sesión tras un periodo de inactividad. Inicia sesión de
                            nuevo para continuar.
                        </p>
                        <Button onClick={handleIniciarSesion} className="w-full">
                            Iniciar sesión
                        </Button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SessionExpiredModal;