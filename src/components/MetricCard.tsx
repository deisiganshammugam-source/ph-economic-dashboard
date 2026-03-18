"use client";

interface MetricCardProps {
  label: string;
  value: string;
  change: number | null;
  color: string;
  prefix?: string;
}

export default function MetricCard({ label, value, change, color, prefix = "" }: MetricCardProps) {
  const isPositive = change !== null && change >= 0;
  const changeColor = change === null ? "text-gray-400" : isPositive ? "text-red-500" : "text-green-600";
  // For VIX and USD/PHP, up = bad for PH economy. For PSEi, down = bad.
  // We keep the standard coloring: green = down, red = up (since oil/VIX up is negative for PH)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold" style={{ color }}>
        {prefix}{value}
      </p>
      {change !== null && (
        <p className={`text-sm font-medium mt-1 ${changeColor}`}>
          {isPositive ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
        </p>
      )}
    </div>
  );
}
