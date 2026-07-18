import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { User, Mail, Lock, Shield, ArrowLeft } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuthStore } from "../store/authStore";
import * as usuariosApi from "../api/usuariosApi";
import PasswordStrengthIndicator from "../components/ui/PasswordStrengthIndicator"; // nuevo import

const ConfiguracionPage = () => {
    const { usuario, setAuth, token } = useAuthStore();
    const navigate = useNavigate();

    const [nombre, setNombre] = useState(usuario?.nombre || "");
    const [guardandoPerfil, setGuardandoPerfil] = useState(false);

    const [passwordActual, setPasswordActual] = useState("");
    const [passwordNueva, setPasswordNueva] = useState("");
    const [cambiandoPassword, setCambiandoPassword] = useState(false);

    const handleGuardarPerfil = async (e: React.FormEvent) => {
        e.preventDefault();
        setGuardandoPerfil(true);
        try {
            const actualizado = await usuariosApi.actualizarPerfil(nombre);
            if (token) setAuth(actualizado, token, true);
            toast.success("Perfil actualizado");
        } catch {
            toast.error("No se pudo actualizar el perfil");
        } finally {
            setGuardandoPerfil(false);
        }
    };

    const handleCambiarPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setCambiandoPassword(true);
        try {
            await usuariosApi.cambiarPassword(passwordActual, passwordNueva);
            toast.success("Contraseña actualizada");
            setPasswordActual("");
            setPasswordNueva("");
        } catch (error) {
            const mensaje = isAxiosError(error)
                ? error.response?.data?.mensaje || "No se pudo cambiar la contraseña"
                : "No se pudo cambiar la contraseña";
            toast.error(mensaje);
        } finally {
            setCambiandoPassword(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-deep">
            <Navbar />

            <main className="max-w-2xl mx-auto px-6 py-10">
                {/* Botón de volver */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-sm mb-6 transition-colors"
                >
                    <ArrowLeft size={15} />
                    Volver
                </button>

                <h1 className="font-display font-semibold text-2xl text-text-primary mb-1">
                    Configuración
                </h1>
                <p className="text-text-secondary text-sm mb-8">
                    Administra tu cuenta y preferencias
                </p>

                <div className="flex flex-col gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-surface border border-border rounded-xl p-6"
                    >
                        <h3 className="text-sm font-medium text-text-primary mb-4 flex items-center gap-2">
                            <User size={15} className="text-text-secondary" />
                            Perfil
                        </h3>

                        <form onSubmit={handleGuardarPerfil} className="flex flex-col gap-4">
                            <Input
                                label="Nombre completo"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs text-text-secondary">Correo electrónico</label>
                                <div className="flex items-center gap-2 bg-bg-deep border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-secondary">
                                    <Mail size={14} />
                                    {usuario?.email}
                                </div>
                                <span className="text-xs text-text-secondary/60">
                                    El correo no se puede modificar
                                </span>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs text-text-secondary">Rol</label>
                                <div className="flex items-center gap-2 bg-bg-deep border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-secondary">
                                    <Shield size={14} />
                                    {usuario?.rol}
                                </div>
                            </div>

                            <Button type="submit" isLoading={guardandoPerfil} className="self-start mt-1">
                                Guardar cambios
                            </Button>
                        </form>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="bg-surface border border-border rounded-xl p-6"
                    >
                        <h3 className="text-sm font-medium text-text-primary mb-4 flex items-center gap-2">
                            <Lock size={15} className="text-text-secondary" />
                            Cambiar contraseña
                        </h3>

                        <form onSubmit={handleCambiarPassword} className="flex flex-col gap-4">
                            <Input
                                label="Contraseña actual"
                                type="password"
                                value={passwordActual}
                                onChange={(e) => setPasswordActual(e.target.value)}
                                required
                            />
                            <Input
                                label="Nueva contraseña"
                                type="password"
                                value={passwordNueva}
                                onChange={(e) => setPasswordNueva(e.target.value)}
                                required
                                minLength={8}
                            />
                            <PasswordStrengthIndicator password={passwordNueva} /> {/* nuevo */}

                            <Button
                                type="submit"
                                isLoading={cambiandoPassword}
                                variant="secondary"
                                className="self-start mt-1"
                            >
                                Actualizar contraseña
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default ConfiguracionPage;