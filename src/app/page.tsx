import { supabase } from "@/lib/supabase";
import Dashboard from "@/components/Dashboard";

// Always fetch fresh data from Supabase on each request
export const dynamic = "force-dynamic";

async function getDailyMarket() {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const { data, error } = await supabase
    .from("ph_daily_market")
    .select("date, ticker, name, close")
    .gte("date", sixMonthsAgo.toISOString().split("T")[0])
    .order("date", { ascending: true });

  if (error) {
    console.error("daily_market query error:", error);
    return [];
  }
  return data || [];
}

async function getIndicators() {
  const { data, error } = await supabase
    .from("ph_economic_indicators")
    .select("date, source, code, name, value, unit")
    .order("date", { ascending: true });

  if (error) {
    console.error("economic_indicators query error:", error);
    return [];
  }
  return data || [];
}

async function getLastRefresh() {
  const { data } = await supabase
    .from("ph_refresh_log")
    .select("completed_at")
    .eq("status", "success")
    .order("completed_at", { ascending: false })
    .limit(1);

  return data?.[0]?.completed_at || null;
}

export default async function Home() {
  const [dailyMarket, indicators, lastRefresh] = await Promise.all([
    getDailyMarket(),
    getIndicators(),
    getLastRefresh(),
  ]);

  return (
    <Dashboard
      dailyMarket={dailyMarket}
      indicators={indicators}
      lastRefresh={lastRefresh}
    />
  );
}
