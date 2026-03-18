import { IMF_INDICATORS } from "../config";

export interface EconIndicatorRow {
  date: string;
  source: string;
  code: string;
  name: string;
  value: number;
  unit: string;
  frequency: string;
}

const IMF_BASE = "https://www.imf.org/external/datamapper/api/v1";

export async function fetchIMFData(): Promise<EconIndicatorRow[]> {
  const rows: EconIndicatorRow[] = [];

  for (const indicator of IMF_INDICATORS) {
    try {
      const url = `${IMF_BASE}/${indicator.code}/PHL`;
      const res = await fetch(url, {
        signal: AbortSignal.timeout(20000),
      });

      if (!res.ok) {
        console.error(`IMF ${indicator.code}: HTTP ${res.status}`);
        continue;
      }

      const data = await res.json();
      const values = data?.values?.[indicator.code]?.PHL;
      if (!values || typeof values !== "object") continue;

      for (const [year, value] of Object.entries(values)) {
        const numValue = Number(value);
        if (isNaN(numValue)) continue;

        rows.push({
          date: `${year}-01-01`,
          source: "imf",
          code: indicator.code,
          name: indicator.name,
          value: numValue,
          unit: indicator.unit,
          frequency: indicator.frequency,
        });
      }
    } catch (err) {
      console.error(`IMF fetch error for ${indicator.code}:`, err);
    }
  }

  return rows;
}
