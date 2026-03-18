import { WORLDBANK_INDICATORS } from "../config";
import type { EconIndicatorRow } from "./imf";

const WB_BASE = "https://api.worldbank.org/v2/country/PHL/indicator";

export async function fetchWorldBankData(): Promise<EconIndicatorRow[]> {
  const rows: EconIndicatorRow[] = [];

  for (const indicator of WORLDBANK_INDICATORS) {
    try {
      const url = `${WB_BASE}/${indicator.code}?format=json&per_page=20&date=2015:2025`;
      const res = await fetch(url, {
        signal: AbortSignal.timeout(30000),
      });

      if (!res.ok) {
        console.error(`World Bank ${indicator.code}: HTTP ${res.status}`);
        continue;
      }

      const json = await res.json();
      // World Bank returns [metadata, dataArray]
      const dataArray = json?.[1];
      if (!Array.isArray(dataArray)) continue;

      for (const entry of dataArray) {
        if (entry.value == null) continue;
        rows.push({
          date: `${entry.date}-01-01`,
          source: "worldbank",
          code: indicator.code,
          name: indicator.name,
          value: entry.value,
          unit: indicator.unit,
          frequency: indicator.frequency,
        });
      }
    } catch (err) {
      console.error(`World Bank fetch error for ${indicator.code}:`, err);
    }
  }

  return rows;
}
