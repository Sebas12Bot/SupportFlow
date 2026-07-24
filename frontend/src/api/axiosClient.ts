import axios from "axios";
import { obtenerToken, limpiarSesion } from "../utils/storage";
import { useUIStore } from "../store/uiStore";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosClient.interceptors.request.use((config) => {
    const token = obtenerToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            limpiarSesion();
            useUIStore.getState().marcarSesionExpirada();
        }
        return Promise.reject(error);
    }
);

export default axiosClient;