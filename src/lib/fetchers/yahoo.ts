import { DAILY_TICKERS } from "../config";

export interface DailyMarketRow {
  date: string;
  ticker: string;
  name: string;
  close: number;
  open: number | null;
  high: number | null;
  low: number | null;
  volume: number | null;
}

const YAHOO_CHART_URL = "https://query1.finance.yahoo.com/v8/finance/chart";

interface YahooChartResult {
  chart?: {
    result?: Array<{
      timestamp?: number[];
      indicators?: {
        quote?: Array<{
          open?: (number | null)[];
          high?: (number | null)[];
          low?: (number | null)[];
          close?: (number | null)[];
          volume?: (number | null)[];
        }>;
      };
    }>;
    error?: { code: string; description: string };
  };
}

export async function fetchYahooFinanceData(): Promise<DailyMarketRow[]> {
  const rows: DailyMarketRow[] = [];

  for (const { ticker, name } of DAILY_TICKERS) {
    try {
      const encoded = encodeURIComponent(ticker);
      const url = `${YAHOO_CHART_URL}/${encoded}?range=6mo&interval=1d&includePrePost=false`;

      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        },
        signal: AbortSignal.timeout(15000),
      });

      if (!res.ok) {
        console.error(`Yahoo ${ticker}: HTTP ${res.status}`);
        continue;
      }

      const data: YahooChartResult = await res.json();
      const result = data?.chart?.result?.[0];
      if (!result?.timestamp || !result?.indicators?.quote?.[0]) continue;

      const { timestamp, indicators } = result;
      const quote = indicators.quote?.[0];
      if (!quote) continue;

      for (let i = 0; i < timestamp.length; i++) {
        const closeVal = quote.close?.[i];
        if (closeVal == null) continue;

        const dateObj = new Date(timestamp[i] * 1000);
        const dateStr = dateObj.toISOString().split("T")[0];

        rows.push({
          date: dateStr,
          ticker,
          name,
          close: closeVal,
          open: quote.open?.[i] ?? null,
          high: quote.high?.[i] ?? null,
          low: quote.low?.[i] ?? null,
          volume: quote.volume?.[i] ?? null,
        });
      }
    } catch (err) {
      console.error(`Yahoo Finance error for ${ticker}:`, err);
    }
  }

  return rows;
}
