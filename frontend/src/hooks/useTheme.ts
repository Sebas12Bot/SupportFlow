import { useEffect, useState } from "react";

export const useTheme = () => {
    const [isDark, setIsDark] = useState(() => {
        const guardado = localStorage.getItem("supportflow_theme");
        return guardado ? guardado === "dark" : true;
    });

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.remove("light");
            localStorage.setItem("supportflow_theme", "dark");
        } else {
            root.classList.add("light");
            localStorage.setItem("supportflow_theme", "light");
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark((prev) => !prev);

    return { isDark, toggleTheme };
};