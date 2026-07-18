import { LogOut, Ticket, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import ThemeToggle from "../ui/ThemeToggle";
import { Link } from "react-router-dom";

const Navbar = () => {
    const { usuario, cerrarSesion } = useAuth();

    return (
        <nav className="border-b border-border bg-surface/60 backdrop-blur-sm sticky top-0 z-40">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <motion.div
                        animate={{ rotate: [0, -8, 8, -4, 0] }}
                        transition={{
                            duration: 2.2,
                            repeat: Infinity,
                            repeatDelay: 1.5,
                            ease: "easeInOut",
                        }}
                        className="w-8 h-8 rounded-lg bg-signal/15 border border-signal/30 flex items-center justify-center"
                    >
                        <Ticket size={16} className="text-signal" />
                    </motion.div>
                    <span className="font-display font-semibold text-text-primary text-[15px] tracking-wide">
                        SupportFlow
                    </span>
                </div>

                <div className="flex items-center gap-5">
                    <ThemeToggle />
                    <Link
                        to="/configuracion"
                        className="text-text-secondary hover:text-text-primary transition-colors p-2"
                    >
                        <Settings size={16} />
                    </Link>
                    <div className="h-5 w-px bg-border" />
                    <div className="flex flex-col items-end">
                        <span className="text-sm text-text-primary font-medium">
                            {usuario?.nombre}
                        </span>
                        <span className="text-xs text-text-secondary">{usuario?.rol}</span>
                    </div>
                    <button
                        onClick={cerrarSesion}
                        className="text-text-secondary hover:text-critical transition-colors p-2"
                        aria-label="Cerrar sesión"
                    >
                        <LogOut size={17} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
