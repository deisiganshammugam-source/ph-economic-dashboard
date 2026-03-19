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

function detectFrequency(data: DataPoint[]): "daily" | "annual" {
  if (data.length < 2) return "daily";
  const dates = data.map((d) => d.date).sort();
  const first = parseISO(dates[0]);
  const second = parseISO(dates[1]);
  const diffDays = (second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays > 180 ? "annual" : "daily";
}

export default function TimeSeriesChart({
  title,
  data,
  color,
  unit = "",
  height = 280,
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
  const freq = detectFrequency(sorted);
  const isAnnual = freq === "annual";

  // For annual data, trim to last 20 years for readability
  const displayData = isAnnual ? sorted.slice(-20) : sorted;

  // Sanitize gradient ID (no spaces/special chars)
  const gradId = `grad-${title.replace(/[^a-zA-Z0-9]/g, "")}`;

  // Compute YTD change for daily data
  let ytdChange: number | null = null;
  let feb28Change: number | null = null;
  if (!isAnnual && sorted.length >= 2) {
    const latest = sorted[sorted.length - 1];
    const currentYear = new Date(latest.date).getFullYear();
    const yearEnd = `${currentYear - 1}-12-31`;
    const feb28Date = "2025-02-28";

    // Find closest row on or before target
    const findClosest = (target: string) => {
      let best: DataPoint | null = null;
      for (const row of sorted) {
        if (row.date <= target) best = row;
        else break;
      }
      return best;
    };

    const ytdRow = findClosest(yearEnd);
    if (ytdRow) ytdChange = ((latest.value - ytdRow.value) / ytdRow.value) * 100;

    const feb28Row = findClosest(feb28Date);
    if (feb28Row) feb28Change = ((latest.value - feb28Row.value) / feb28Row.value) * 100;
  }

  const formatBadge = (label: string, val: number | null) => {
    if (val === null) return null;
    const isPos = val >= 0;
    const cls = isPos ? "text-red-600 bg-red-50" : "text-green-700 bg-green-50";
    return (
      <span key={label} className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${cls}`}>
        {label}: {isPos ? "+" : ""}{val.toFixed(2)}%
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        {!isAnnual && (
          <div className="flex gap-1.5">
            {formatBadge("YTD", ytdChange)}
            {formatBadge("Feb 28", feb28Change)}
          </div>
        )}
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={displayData} margin={{ top: 5, right: 15, left: 5, bottom: 5 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.2} />
              <stop offset="95%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(d: string) => {
              try {
                const parsed = parseISO(d);
                return isAnnual ? format(parsed, "yyyy") : format(parsed, "MMM ''yy");
              } catch {
                return d;
              }
            }}
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
            minTickGap={isAnnual ? 30 : 50}
            angle={isAnnual ? -45 : 0}
            textAnchor={isAnnual ? "end" : "middle"}
            height={isAnnual ? 50 : 30}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
            domain={["auto", "auto"]}
            width={55}
            tickFormatter={(v: number) =>
              Math.abs(v) >= 1e9
                ? `${(v / 1e9).toFixed(1)}B`
                : Math.abs(v) >= 1e6
                ? `${(v / 1e6).toFixed(1)}M`
                : v.toLocaleString()
            }
          />
          <Tooltip
            formatter={(val: number) => [
              `${val.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${unit}`,
              title,
            ]}
            labelFormatter={(d: string) => {
              try {
                const parsed = parseISO(d);
                return isAnnual ? format(parsed, "yyyy") : format(parsed, "MMM d, yyyy");
              } catch {
                return d;
              }
            }}
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#${gradId})`}
            dot={false}
            activeDot={{ r: 5, fill: color, stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
