import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import LoginPage from "../pages/LoginPage";
import RegistroPage from "../pages/RegistroPage";
import DashboardUsuarioPage from "../pages/DashboardUsuarioPage";
import CrearTicketPage from "../pages/CrearTicketPage";
import DetalleTicketPage from "../pages/DetalleTicketPage";
import DashboardAgentePage from "../pages/DashboardAgentePage";
import NotFoundPage from "../pages/NotFoundPage";
import ConfiguracionPage from "../pages/ConfiguracionPage";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/registro" element={<RegistroPage />} />
                </Route>

                <Route element={<ProtectedRoute rolesPermitidos={["USUARIO"]} />}>
                    <Route path="/dashboard" element={<DashboardUsuarioPage />} />
                    <Route path="/crear-ticket" element={<CrearTicketPage />} />
                </Route>

                <Route element={<ProtectedRoute rolesPermitidos={["AGENTE"]} />}>
                    <Route path="/agente" element={<DashboardAgentePage />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                    <Route path="/tickets/:id" element={<DetalleTicketPage />} />
                    <Route path="/configuracion" element={<ConfiguracionPage />} />
                </Route>

                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
