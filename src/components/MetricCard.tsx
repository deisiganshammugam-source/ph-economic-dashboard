"use client";

interface MetricCardProps {
  label: string;
  value: string;
  change: number | null;
  ytdChange: number | null;
  feb28Change: number | null;
  color: string;
  prefix?: string;
}

function ChangeBadge({ label, value }: { label: string; value: number | null }) {
  if (value === null) return null;
  const isPositive = value >= 0;
  const bgColor = isPositive ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700";
  return (
    <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium ${bgColor}`}>
      {label}: {isPositive ? "+" : ""}{value.toFixed(2)}%
    </span>
  );
}

export default function MetricCard({
  label,
  value,
  change,
  ytdChange,
  feb28Change,
  color,
  prefix = "",
}: MetricCardProps) {
  const isPositive = change !== null && change >= 0;
  const changeColor = change === null ? "text-gray-400" : isPositive ? "text-red-500" : "text-green-600";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold" style={{ color }}>
        {prefix}{value}
      </p>
      {change !== null && (
        <p className={`text-sm font-medium mt-1 ${changeColor}`}>
          {isPositive ? "▲" : "▼"} {Math.abs(change).toFixed(2)}% <span className="text-gray-400 font-normal">1d</span>
        </p>
      )}
      <div className="flex flex-wrap gap-1.5 mt-2">
        <ChangeBadge label="YTD" value={ytdChange} />
        <ChangeBadge label="Feb 28" value={feb28Change} />
      </div>
    </div>
  );
}
