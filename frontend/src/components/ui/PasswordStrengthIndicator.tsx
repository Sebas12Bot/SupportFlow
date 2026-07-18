import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { evaluarPassword, calcularFortaleza } from "../../utils/passwordStrength";

interface PasswordStrengthIndicatorProps {
    password: string;
}

const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
    if (!password) return null;

    const requisitos = evaluarPassword(password);
    const fortaleza = calcularFortaleza(password);

    const colorBarra =
        fortaleza < 0.4 ? "bg-critical" : fortaleza < 0.8 ? "bg-warn" : "bg-resolved";
    const labelFortaleza = fortaleza < 0.4 ? "Débil" : fortaleza < 0.8 ? "Media" : "Fuerte";
    const colorLabel =
        fortaleza < 0.4 ? "text-critical" : fortaleza < 0.8 ? "text-warn" : "text-resolved";

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-2.5 mt-1"
        >
            <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                    <motion.div
                        animate={{ width: `${fortaleza * 100}%` }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className={`h-full rounded-full ${colorBarra}`}
                    />
                </div>
                <span className={`text-xs font-medium ${colorLabel}`}>{labelFortaleza}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5">
                {requisitos.map((r) => (
                    <div key={r.label} className="flex items-center gap-1.5">
                        {r.cumplido ? (
                            <Check size={12} className="text-resolved shrink-0" />
                        ) : (
                            <X size={12} className="text-text-secondary/50 shrink-0" />
                        )}
                        <span
                            className={`text-xs ${r.cumplido ? "text-text-secondary" : "text-text-secondary/50"}`}
                        >
                            {r.label}
                        </span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default PasswordStrengthIndicator;