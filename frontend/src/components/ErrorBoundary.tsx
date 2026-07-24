import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import Button from "./ui/Button";

interface Props {
    children: ReactNode;
}

interface State {
    tieneError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    state: State = { tieneError: false };

    static getDerivedStateFromError(): State {
        return { tieneError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error("Error capturado por ErrorBoundary:", error, info);
    }

    render() {
        if (this.state.tieneError) {
            return (
                <div className="min-h-screen bg-bg-deep flex items-center justify-center px-4">
                    <div className="text-center max-w-sm">
                        <div className="w-14 h-14 rounded-xl bg-critical/10 border border-critical/30 flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle size={22} className="text-critical" />
                        </div>
                        <p className="text-text-primary font-medium mb-1">Algo se rompió</p>
                        <p className="text-text-secondary text-sm mb-8">
                            Ocurrió un error inesperado en la aplicación. Intenta recargar la página.
                        </p>
                        <Button onClick={() => window.location.reload()}>Recargar</Button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;