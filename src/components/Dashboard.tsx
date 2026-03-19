"use client";

import MetricCard from "./MetricCard";
import TimeSeriesChart from "./TimeSeriesChart";
import { DAILY_TICKERS, IMF_INDICATORS } from "@/lib/config";

interface MarketRow {
  date: string;
  ticker: string;
  name: string;
  close: number;
}

interface IndicatorRow {
  date: string;
  source: string;
  code: string;
  name: string;
  value: number;
  unit: string;
}

interface DashboardProps {
  dailyMarket: MarketRow[];
  indicators: IndicatorRow[];
  lastRefresh: string | null;
}

function findClosestRow(data: MarketRow[], targetDate: string): MarketRow | null {
  // Find the row on or just before the target date
  const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));
  let best: MarketRow | null = null;
  for (const row of sorted) {
    if (row.date <= targetDate) best = row;
    else break;
  }
  return best;
}

function getLatestAndChanges(data: MarketRow[]) {
  if (data.length < 1) return { latest: null, change: null, ytdChange: null, feb28Change: null };
  const sorted = [...data].sort((a, b) => b.date.localeCompare(a.date));
  const latest = sorted[0];
  const prev = sorted[1];
  const change = prev ? ((latest.close - prev.close) / prev.close) * 100 : null;

  // YTD: change since last trading day of previous year (Dec 31 or closest before)
  const currentYear = new Date(latest.date).getFullYear();
  const yearEnd = `${currentYear - 1}-12-31`;
  const ytdRow = findClosestRow(data, yearEnd);
  const ytdChange = ytdRow ? ((latest.close - ytdRow.close) / ytdRow.close) * 100 : null;

  // Since Feb 28, 2025
  const feb28Row = findClosestRow(data, "2025-02-28");
  const feb28Change = feb28Row ? ((latest.close - feb28Row.close) / feb28Row.close) * 100 : null;

  return { latest, change, ytdChange, feb28Change };
}

export default function Dashboard({ dailyMarket, indicators, lastRefresh }: DashboardProps) {
  // Group daily market data by ticker
  const byTicker: Record<string, MarketRow[]> = {};
  for (const row of dailyMarket) {
    if (!byTicker[row.ticker]) byTicker[row.ticker] = [];
    byTicker[row.ticker].push(row);
  }

  // Group indicators by code
  const byCode: Record<string, IndicatorRow[]> = {};
  for (const row of indicators) {
    if (!byCode[row.code]) byCode[row.code] = [];
    byCode[row.code].push(row);
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Philippines: Middle East Conflict Economic Impact
              </h1>
              <p className="text-slate-300 text-sm mt-1">
                Tracking transmission channels from U.S.–Iran tensions to the Philippine economy
              </p>
            </div>
            {lastRefresh && (
              <p className="text-xs text-slate-400 whitespace-nowrap">
                Last refresh: {new Date(lastRefresh).toLocaleString("en-PH", { timeZone: "Asia/Manila" })}
              </p>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Metric Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {DAILY_TICKERS.map((t) => {
            const { latest, change, ytdChange, feb28Change } = getLatestAndChanges(byTicker[t.ticker] || []);
            return (
              <MetricCard
                key={t.ticker}
                label={t.name}
                value={latest ? latest.close.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—"}
                change={change}
                ytdChange={ytdChange}
                feb28Change={feb28Change}
                color={t.color}
                prefix={t.prefix}
              />
            );
          })}
        </section>

        {/* Daily Charts */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Daily Market Data (6 Months)</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {DAILY_TICKERS.map((t) => {
              const data = (byTicker[t.ticker] || []).map((r) => ({
                date: r.date,
                value: r.close,
              }));
              return (
                <TimeSeriesChart
                  key={t.ticker}
                  title={t.name}
                  data={data}
                  color={t.color}
                  unit={t.unit}
                />
              );
            })}
          </div>
        </section>

        {/* IMF WEO Indicators */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Macro Fundamentals (IMF WEO)</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {IMF_INDICATORS.map((ind, i) => {
              const colors = ["#6366F1", "#EC4899", "#0EA5E9", "#F59E0B", "#14B8A6"];
              const data = (byCode[ind.code] || []).map((r) => ({
                date: r.date,
                value: r.value,
              }));
              return (
                <TimeSeriesChart
                  key={ind.code}
                  title={ind.name}
                  data={data}
                  color={colors[i % colors.length]}
                  unit={ind.unit}
                />
              );
            })}
          </div>
        </section>

        {/* Annual Context (World Bank) */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Annual Context (World Bank)</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {([
              { code: "BX.TRF.PWKR.CD.DT", color: "#8B5CF6" },
              { code: "FP.CPI.TOTL.ZG", color: "#F43F5E" },
              { code: "NY.GDP.MKTP.KD.ZG", color: "#059669" },
              { code: "BN.CAB.XOKA.GD.ZS", color: "#D97706" },
            ] as const).map(({ code, color }) => {
                const rows = byCode[code] || [];
                const data = rows.map((r) => ({ date: r.date, value: r.value }));
                const label = rows[0]?.name || code;
                return (
                  <TimeSeriesChart
                    key={code}
                    title={label}
                    data={data}
                    color={color}
                    unit={rows[0]?.unit || ""}
                  />
                );
              }
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-xs text-gray-400 py-4 border-t border-gray-100">
          Sources: Yahoo Finance, IMF International Financial Statistics, World Bank Open Data.
          Data refreshes daily at 8:00 AM Manila time.
        </footer>
      </main>
    </div>
  );
}
