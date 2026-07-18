import { useEffect, useRef } from "react";

interface Nodo {
    x: number;
    y: number;
    r: number;
    pulso: number;
    vx: number;
    vy: number;
}

interface Tarjeta {
    x: number;
    y: number;
    texto: string;
    vida: number;
    vidaMax: number;
}

const ETIQUETAS = [
    "#TCK-4021 abierto",
    "SLA: 2h 14m",
    "Agente asignado",
    "#TCK-4022 resuelto",
    "Carga: 68%",
    "Nuevo reporte",
    "Historial actualizado",
    "Estado: en progreso",
];

const NUM_NODOS = 9;

const NocPanel = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let ancho = 0;
        let alto = 0;

        const redimensionar = () => {
            const rect = canvas.getBoundingClientRect();
            ancho = rect.width;
            alto = rect.height;
            canvas.width = ancho * devicePixelRatio;
            canvas.height = alto * devicePixelRatio;
            ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
        };
        redimensionar();

        const nodos: Nodo[] = Array.from({ length: NUM_NODOS }, () => ({
            x: 40 + Math.random() * (ancho - 80),
            y: 40 + Math.random() * (alto - 80),
            r: 2.5 + Math.random() * 2,
            pulso: Math.random() * Math.PI * 2,
            vx: (Math.random() - 0.5) * 0.08,
            vy: (Math.random() - 0.5) * 0.08,
        }));

        const aristas: [number, number][] = [];
        for (let i = 0; i < NUM_NODOS; i++) {
            const conexiones = 1 + Math.floor(Math.random() * 2);
            for (let c = 0; c < conexiones; c++) {
                const j = Math.floor(Math.random() * NUM_NODOS);
                if (j !== i) aristas.push([i, j]);
            }
        }

        let tarjetas: Tarjeta[] = [];
        const generarTarjeta = () => {
            const nodo = nodos[Math.floor(Math.random() * nodos.length)];
            tarjetas.push({
                x: nodo.x,
                y: nodo.y,
                texto: ETIQUETAS[Math.floor(Math.random() * ETIQUETAS.length)],
                vida: 0,
                vidaMax: 140,
            });
            if (tarjetas.length > 4) tarjetas.shift();
        };
        const intervaloTarjetas = setInterval(generarTarjeta, 1400);

        const prefiereReducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const dibujar = () => {
            ctx.clearRect(0, 0, ancho, alto);

            nodos.forEach((n) => {
                n.x += n.vx;
                n.y += n.vy;
                if (n.x < 30 || n.x > ancho - 30) n.vx *= -1;
                if (n.y < 30 || n.y > alto - 30) n.vy *= -1;
                n.pulso += 0.03;
            });

            ctx.lineWidth = 0.6;
            aristas.forEach(([i, j]) => {
                const a = nodos[i];
                const b = nodos[j];
                const dist = Math.hypot(a.x - b.x, a.y - b.y);
                const alpha = Math.max(0, 0.12 - dist / 2400);
                ctx.strokeStyle = `rgba(91,140,255,${0.08 + alpha})`;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            });

            nodos.forEach((n) => {
                const glow = (Math.sin(n.pulso) + 1) / 2;
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r + glow * 1.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(91,140,255,${0.5 + glow * 0.4})`;
                ctx.fill();
            });

            tarjetas = tarjetas.filter((c) => c.vida < c.vidaMax);
            tarjetas.forEach((c) => {
                c.vida += 1;
                const p = c.vida / c.vidaMax;
                const opacidad = p < 0.15 ? p / 0.15 : p > 0.8 ? (1 - p) / 0.2 : 1;
                const desplazoY = -p * 22;

                ctx.font = "10px 'JetBrains Mono', monospace";
                const anchoTexto = ctx.measureText(c.texto).width;
                const padX = 8;
                const bx = c.x + 10;
                const by = c.y + desplazoY - 14;

                ctx.fillStyle = `rgba(18,21,31,${0.9 * opacidad})`;
                ctx.strokeStyle = `rgba(91,140,255,${0.35 * opacidad})`;
                ctx.lineWidth = 0.6;
                ctx.beginPath();
                ctx.roundRect(bx, by, anchoTexto + padX * 2, 20, 5);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = `rgba(240,242,247,${0.85 * opacidad})`;
                ctx.fillText(c.texto, bx + padX, by + 13.5);
            });

            if (!prefiereReducirMovimiento) {
                animationRef.current = requestAnimationFrame(dibujar);
            }
        };

        dibujar();

        const handleResize = () => redimensionar();
        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(animationRef.current);
            clearInterval(intervaloTarjetas);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="relative w-full h-full overflow-hidden bg-bg-deep">
            <canvas ref={canvasRef} className="w-full h-full block" />
        </div>
    );
};

export default NocPanel;