import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const PublicRoute = () => {
    const { usuario, token } = useAuthStore();

    if (token && usuario) {
        return <Navigate to={usuario.rol === "AGENTE" ? "/agente" : "/dashboard"} replace />;
    }

    return <Outlet />;
};

export default PublicRoute;