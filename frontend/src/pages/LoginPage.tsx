import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import ThemeToggle from "../components/ui/ThemeToggle";
import NocPanel from "../components/ui/NocPanel";

const LoginPage = () => {
    const { iniciarSesion } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cargando, setCargando] = useState(false);
    const [recordar, setRecordar] = useState(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCargando(true);
        try {
            await iniciarSesion(email, password, recordar);
        } catch {
            // el toast de error ya lo maneja useAuth
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-deep flex">
            {/* Panel NOC visible solo en pantallas grandes */}
            <div className="hidden lg:block lg:w-1/2 relative border-r border-border">
                <NocPanel />
                <div className="absolute bottom-8 left-8 right-8">
                    <p className="text-text-secondary text-xs font-mono">
                        Centro de operaciones · SupportFlow
                    </p>
                </div>
            </div>

            {/* Columna del formulario */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-4 relative">
                <div className="absolute top-6 right-6">
                    <ThemeToggle />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="w-full max-w-sm"
                >
                    <div className="flex items-center gap-3 mb-9">
                        <motion.div
                            animate={{ rotate: [0, -8, 8, -4, 0] }}
                            transition={{
                                duration: 2.2,
                                repeat: Infinity,
                                repeatDelay: 1.5,
                                ease: "easeInOut",
                            }}
                            className="w-9 h-9 rounded-lg bg-signal/15 border border-signal/30 flex items-center justify-center"
                        >
                            <Ticket size={18} className="text-signal" />
                        </motion.div>
                        <span className="font-display font-semibold text-text-primary text-2xl tracking-wide">
                            SupportFlow
                        </span>
                    </div>

                    <h1 className="font-display font-semibold text-2xl text-text-primary mb-1.5">
                        Bienvenido de nuevo
                    </h1>
                    <p className="text-text-secondary text-sm mb-8">
                        Accede a tu panel de incidencias
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="relative">
                            <Mail size={16} className="absolute left-3.5 top-[38px] text-text-secondary" />
                            <Input
                                label="Correo electrónico"
                                type="email"
                                placeholder="nombre@empresa.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="pl-10"
                            />
                        </div>

                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-[38px] text-text-secondary" />
                            <Input
                                label="Contraseña"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="pl-10"
                            />
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={recordar}
                                onChange={(e) => setRecordar(e.target.checked)}
                                className="w-4 h-4 rounded border-border bg-surface accent-signal cursor-pointer"
                            />
                            <span className="text-sm text-text-secondary">Permanecer conectado</span>
                        </label>

                        <Button type="submit" isLoading={cargando} className="w-full mt-2">
                            Iniciar sesión
                            <ArrowRight size={16} />
                        </Button>
                    </form>

                    <p className="text-center text-text-secondary text-sm mt-7">
                        ¿No tienes cuenta?{" "}
                        <Link to="/registro" className="text-signal hover:underline">
                            Regístrate
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;