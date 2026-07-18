import { WifiOff, ServerCrash, RefreshCw } from "lucide-react";
import Button from "./Button";

interface ErrorStateProps {
    tipo?: "red" | "servidor";
    onReintentar?: () => void;
}

const ErrorState = ({ tipo = "servidor", onReintentar }: ErrorStateProps) => {
    const esRed = tipo === "red";

    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-xl bg-critical/10 border border-critical/30 flex items-center justify-center mb-4">
                {esRed ? (
                    <WifiOff size={20} className="text-critical" />
                ) : (
                    <ServerCrash size={20} className="text-critical" />
                )}
            </div>
            <p className="text-text-primary font-medium mb-1">
                {esRed ? "Sin conexión con el servidor" : "Algo salió mal"}
            </p>
            <p className="text-text-secondary text-sm mb-6 max-w-xs">
                {esRed
                    ? "No pudimos conectarnos a SupportFlow. Revisa tu conexión e intenta de nuevo."
                    : "Ocurrió un error inesperado al procesar tu solicitud."}
            </p>
            {onReintentar && (
                <Button variant="secondary" onClick={onReintentar}>
                    <RefreshCw size={14} />
                    Reintentar
                </Button>
            )}
        </div>
    );
};

export default ErrorState;