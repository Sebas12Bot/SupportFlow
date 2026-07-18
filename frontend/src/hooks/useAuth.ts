import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import * as authApi from "../api/authApi";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";

export const useAuth = () => {
    const { usuario, token, setAuth, logout } = useAuthStore();
    const navigate = useNavigate();

    const obtenerMensajeError = (error: unknown, mensajePorDefecto: string): string => {
        if (isAxiosError(error)) {
            return error.response?.data?.mensaje || mensajePorDefecto;
        }
        return mensajePorDefecto;
    };

    const iniciarSesion = async (email: string, password: string, recordar: boolean) => {
        try {
            const respuesta = await authApi.login(email, password);
            setAuth(respuesta.usuario, respuesta.token, recordar);
            toast.success(`Bienvenido, ${respuesta.usuario.nombre}`);
            navigate(respuesta.usuario.rol === "AGENTE" ? "/agente" : "/dashboard");
        } catch (error) {
            toast.error(obtenerMensajeError(error, "Error al iniciar sesión"));
            throw error;
        }
    };

    const registrarse = async (
        nombre: string,
        email: string,
        password: string,
        codigoInvitacion?: string
    ) => {
        try {
            const respuesta = await authApi.registrar(nombre, email, password, codigoInvitacion);
            setAuth(respuesta.usuario, respuesta.token, true);
            toast.success(`Cuenta creada, bienvenido ${respuesta.usuario.nombre}`);
            navigate(respuesta.usuario.rol === "AGENTE" ? "/agente" : "/dashboard");
        } catch (error) {
            toast.error(obtenerMensajeError(error, "Error al registrarse"));
            throw error;
        }
    };

    const cerrarSesion = () => {
        logout();
        navigate("/login");
    };

    return { usuario, token, iniciarSesion, registrarse, cerrarSesion, estaAutenticado: !!token };
};