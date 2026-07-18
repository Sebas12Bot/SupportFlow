import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Ticket, ArrowLeft } from "lucide-react";
import Button from "../components/ui/Button";
import { PiButterflyFill } from "react-icons/pi";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-bg-deep flex items-center justify-center px-4 relative">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center max-w-sm"
            >
                <div className="w-14 h-14 rounded-xl bg-surface border border-border flex items-center justify-center mx-auto mb-6">
                    <Ticket size={22} className="text-text-secondary" />
                </div>
                <h1 className="font-display font-semibold text-5xl text-text-primary mb-2">404</h1>
                <p className="text-text-primary font-medium mb-1">Esta página no existe</p>
                <p className="text-text-secondary text-sm mb-8">
                    El ticket, ruta o recurso que buscas no está disponible.
                </p>
                <Button onClick={() => navigate(-1)} variant="secondary" className="mx-auto">
                    <ArrowLeft size={15} />
                    Volver atrás
                </Button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                animate={{
                    opacity: [0.15, 0.35, 0.15],
                    y: [0, -5, 0],
                    x: [0, 2, -2, 0],
                    rotate: [-3, 3, -3],
                    scale: [0.95, 1, 0.95],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                whileHover={{
                    scale: 1.15,
                    rotate: 10,
                    y: -10,
                    opacity: 0.6,
                }}
                className="absolute bottom-4 right-4"
            >
                <PiButterflyFill
                    size={18}
                    className="text-violet-900 dark:text-violet-700"
                />
            </motion.div>
        </div>
    );
};

export default NotFoundPage;