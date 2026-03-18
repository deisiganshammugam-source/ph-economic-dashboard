"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { format, parseISO } from "date-fns";

interface DataPoint {
  date: string;
  value: number;
}

interface TimeSeriesChartProps {
  title: string;
  data: DataPoint[];
  color: string;
  unit?: string;
  height?: number;
}

export default function TimeSeriesChart({
  title,
  data,
  color,
  unit = "",
  height = 260,
}: TimeSeriesChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
        <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
          No data available
        </div>
      </div>
    );
  }

  const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={sorted} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.15} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tickFormatter={(d: string) => {
              try {
                return format(parseISO(d), "MMM d");
              } catch {
                return d;
              }
            }}
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            minTickGap={40}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            domain={["auto", "auto"]}
            width={60}
          />
          <Tooltip
            formatter={(val: number) => [`${val.toLocaleString()} ${unit}`, ""]}
            labelFormatter={(d: string) => {
              try {
                return format(parseISO(d), "MMM d, yyyy");
              } catch {
                return d;
              }
            }}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#grad-${title})`}
            dot={false}
            activeDot={{ r: 4, fill: color }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
