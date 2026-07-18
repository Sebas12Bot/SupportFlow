import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface Props {
    rolesPermitidos?: ("USUARIO" | "AGENTE")[];
}

const ProtectedRoute = ({ rolesPermitidos }: Props) => {
    const { usuario, token } = useAuthStore();

    if (!token || !usuario) {
        return <Navigate to="/login" replace />;
    }

    if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
        return <Navigate to={usuario.rol === "AGENTE" ? "/agente" : "/dashboard"} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;