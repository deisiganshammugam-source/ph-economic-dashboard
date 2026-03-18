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

const IMF_BASE = "https://dataservices.imf.org/REST/SDMX_JSON.svc/CompactData";

export async function fetchIMFData(): Promise<EconIndicatorRow[]> {
  const rows: EconIndicatorRow[] = [];

  for (const indicator of IMF_INDICATORS) {
    try {
      const url = `${IMF_BASE}/IFS/M.PH.${indicator.code}`;
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(30000),
      });

      if (!res.ok) {
        console.error(`IMF ${indicator.code}: HTTP ${res.status}`);
        continue;
      }

      const data = await res.json();
      const series = data?.CompactData?.DataSet?.Series;
      if (!series) continue;

      const observations = Array.isArray(series.Obs) ? series.Obs : series.Obs ? [series.Obs] : [];

      for (const obs of observations) {
        const timePeriod = obs["@TIME_PERIOD"];
        const value = parseFloat(obs["@OBS_VALUE"]);
        if (!timePeriod || isNaN(value)) continue;

        // Convert "2024-01" to "2024-01-01"
        const date = timePeriod.length === 7 ? `${timePeriod}-01` : timePeriod;

        rows.push({
          date,
          source: "imf",
          code: indicator.code,
          name: indicator.name,
          value,
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
