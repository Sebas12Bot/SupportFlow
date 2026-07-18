import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

const ThemeToggle = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative w-14 h-8 rounded-full bg-surface border border-border flex items-center px-1"
            aria-label="Cambiar tema"
        >
            <motion.div
                animate={{ x: isDark ? 0 : 24 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-6 h-6 rounded-full bg-signal flex items-center justify-center"
            >
                {isDark ? <Moon size={14} className="text-bg-deep" /> : <Sun size={14} className="text-bg-deep" />}
            </motion.div>
        </button>
    );
};

export default ThemeToggle;