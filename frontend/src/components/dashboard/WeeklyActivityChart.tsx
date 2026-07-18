import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";

interface WeeklyActivityChartProps {
    datos: { dia: string; creados: number }[];
}

const WeeklyActivityChart = ({ datos }: WeeklyActivityChartProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="bg-surface border border-border rounded-xl p-5"
        >
            <h3 className="text-sm font-medium text-text-primary mb-4">Actividad semanal</h3>
            <div style={{ width: "100%", height: 140 }}>
                <ResponsiveContainer>
                    <BarChart data={datos}>
                        <XAxis
                            dataKey="dia"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#9BA3B7", fontSize: 11 }}
                        />
                        <Tooltip
                            cursor={{ fill: "rgba(91,140,255,0.08)" }}
                            contentStyle={{
                                background: "#12151F",
                                border: "1px solid #232838",
                                borderRadius: 8,
                                fontSize: 12,
                            }}
                            labelStyle={{ color: "#F0F2F7" }}
                        />
                        <Bar dataKey="creados" fill="#5B8CFF" radius={[4, 4, 0, 0]} maxBarSize={28} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default WeeklyActivityChart;