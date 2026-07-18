import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
    label: string;
    valor: string;
    icon: LucideIcon;
    delay?: number;
}

const MetricCard = ({ label, valor, icon: Icon, delay = 0 }: MetricCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay }}
            whileHover={{ y: -2 }}
            className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-2 transition-shadow hover:border-signal/40"
        >
            <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">{label}</span>
                <Icon size={15} className="text-signal" />
            </div>
            <span className="font-display font-semibold text-2xl text-text-primary">{valor}</span>
        </motion.div>
    );
};

export default MetricCard;