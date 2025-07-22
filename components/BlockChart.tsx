import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Block } from "../types";
import {
  calculateDuration,
  formatDuration,
  convertTotalHoursToDuration,
} from "../lib/utils";

interface BlockChartProps {
  blocks: Block[];
}

export const BlockChart: React.FC<BlockChartProps> = ({ blocks }) => {
  const chartData = useMemo(() => {
    const monthlyTotals: { [key: string]: number } = {}; // Key format: "YYYY-MM"

    blocks.forEach((block) => {
      const startDate = new Date(block.startDate);
      const year = startDate.getFullYear();
      const month = startDate.getMonth(); // 0-indexed (0 for Jan)
      const key = `${year}-${String(month).padStart(2, "0")}`;

      const duration = calculateDuration(
        block.startDate,
        block.endDate
      ).totalHours;

      monthlyTotals[key] = (monthlyTotals[key] || 0) + duration;
    });

    return Object.keys(monthlyTotals)
      .sort() // Sorts keys chronologically (e.g., "2023-11", "2024-01")
      .map((key) => {
        const [year, monthIndex] = key.split("-").map(Number);
        const date = new Date(year, monthIndex);
        const monthName = date.toLocaleString("en-US", {
          month: "short",
          year: "numeric",
        });

        return {
          name: monthName,
          duration: monthlyTotals[key],
        };
      });
  }, [blocks]);

  if (blocks.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 text-slate-400">
        <p>No block data to display. Log a new block to see the chart.</p>
      </div>
    );
  }

  const tooltipFormatter = (value: number, name: string) => {
    if (typeof value !== "number" || value < 0) {
      return ["0s", name];
    }
    const durationParts = convertTotalHoursToDuration(value);
    const formattedDuration = formatDuration(durationParts);
    return [formattedDuration, name];
  };

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b", // slate-800
              borderColor: "#334155", // slate-700
              color: "#f1f5f9", // slate-100
            }}
            cursor={{ fill: "#334155" }}
            formatter={tooltipFormatter}
          />
          <Legend wrapperStyle={{ color: "#f1f5f9" }} />
          <Bar dataKey="duration" fill="#0ea5e9" name="Total Duration" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
