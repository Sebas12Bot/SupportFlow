import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary" | "danger";
    isLoading?: boolean;
    children: ReactNode;
}

const estilos = {
    primary: "bg-signal text-bg-deep hover:brightness-110",
    secondary: "bg-transparent border border-border text-text-primary hover:bg-surface-hover",
    danger: "bg-critical text-white hover:brightness-110",
};

const Button = ({ variant = "primary", isLoading, children, className = "", disabled, ...props }: ButtonProps) => {
    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.1 }}
            disabled={disabled || isLoading}
            className={`${estilos[variant]} font-body font-medium text-sm px-5 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${className}`}
            {...props}
        >
            {isLoading ? (
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                />
            ) : null}
            {children}
        </motion.button>
    );
};

export default Button;