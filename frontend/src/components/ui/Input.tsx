import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className = "", ...props }, ref) => {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs text-text-secondary font-body">{label}</label>
            <input
                ref={ref}
                className={`bg-surface border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary font-body placeholder:text-text-secondary/50 focus:outline-none focus:border-signal transition-colors ${error ? "border-critical" : ""
                    } ${className}`}
                {...props}
            />
            {error && <span className="text-xs text-critical font-body">{error}</span>}
        </div>
    );
});

Input.displayName = "Input";

export default Input;