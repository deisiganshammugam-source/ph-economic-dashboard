import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { fetchYahooFinanceData } from "@/lib/fetchers/yahoo";
import { fetchIMFData } from "@/lib/fetchers/imf";
import { fetchWorldBankData } from "@/lib/fetchers/worldbank";

export const maxDuration = 60; // Allow up to 60s for all fetches

export async function GET(request: Request) {
  // Verify Vercel cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: Record<string, { status: string; count: number; error?: string }> = {};

  // 1. Yahoo Finance — daily market data
  try {
    const startedAt = new Date().toISOString();
    const rows = await fetchYahooFinanceData();

    if (rows.length > 0) {
      const { error } = await supabase
        .from("daily_market")
        .upsert(rows, { onConflict: "date,ticker" });

      if (error) throw error;
    }

    results.yahoo = { status: "success", count: rows.length };
    await logRefresh("yahoo", "success", rows.length, null, startedAt);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    results.yahoo = { status: "error", count: 0, error: msg };
    await logRefresh("yahoo", "error", 0, msg, new Date().toISOString());
  }

  // 2. IMF IFS — monthly indicators
  try {
    const startedAt = new Date().toISOString();
    const rows = await fetchIMFData();

    if (rows.length > 0) {
      // Supabase upsert has a batch limit; chunk if needed
      for (let i = 0; i < rows.length; i += 500) {
        const chunk = rows.slice(i, i + 500);
        const { error } = await supabase
          .from("economic_indicators")
          .upsert(chunk, { onConflict: "date,source,code" });
        if (error) throw error;
      }
    }

    results.imf = { status: "success", count: rows.length };
    await logRefresh("imf", "success", rows.length, null, startedAt);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    results.imf = { status: "error", count: 0, error: msg };
    await logRefresh("imf", "error", 0, msg, new Date().toISOString());
  }

  // 3. World Bank — annual indicators
  try {
    const startedAt = new Date().toISOString();
    const rows = await fetchWorldBankData();

    if (rows.length > 0) {
      const { error } = await supabase
        .from("economic_indicators")
        .upsert(rows, { onConflict: "date,source,code" });
      if (error) throw error;
    }

    results.worldbank = { status: "success", count: rows.length };
    await logRefresh("worldbank", "success", rows.length, null, startedAt);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    results.worldbank = { status: "error", count: 0, error: msg };
    await logRefresh("worldbank", "error", 0, msg, new Date().toISOString());
  }

  return NextResponse.json({ ok: true, results });
}

async function logRefresh(
  source: string,
  status: string,
  count: number,
  errorMessage: string | null,
  startedAt: string
) {
  await supabase.from("refresh_log").insert({
    source,
    status,
    records_upserted: count,
    error_message: errorMessage,
    started_at: startedAt,
    completed_at: new Date().toISOString(),
  });
}
