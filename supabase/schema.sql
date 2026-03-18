-- Philippines Economic Impact Dashboard — Supabase Schema
-- Run this in the Supabase SQL Editor to create all tables

-- Daily market data (Yahoo Finance: Brent, USD/PHP, PSEi, VIX)
CREATE TABLE daily_market (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL,
  ticker TEXT NOT NULL,
  name TEXT NOT NULL,
  close NUMERIC NOT NULL,
  open NUMERIC,
  high NUMERIC,
  low NUMERIC,
  volume BIGINT,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date, ticker)
);

-- Monthly/annual economic indicators (IMF, World Bank)
CREATE TABLE economic_indicators (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL,
  source TEXT NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  value NUMERIC,
  unit TEXT,
  frequency TEXT,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date, source, code)
);

-- Refresh audit log
CREATE TABLE refresh_log (
  id BIGSERIAL PRIMARY KEY,
  source TEXT NOT NULL,
  status TEXT NOT NULL,
  records_upserted INT DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Indexes for dashboard queries
CREATE INDEX idx_daily_market_ticker_date ON daily_market (ticker, date DESC);
CREATE INDEX idx_economic_indicators_code_date ON economic_indicators (source, code, date DESC);
CREATE INDEX idx_refresh_log_started ON refresh_log (started_at DESC);

-- Row Level Security: allow read access via anon key for the dashboard
ALTER TABLE daily_market ENABLE ROW LEVEL SECURITY;
ALTER TABLE economic_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE refresh_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON daily_market FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON economic_indicators FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON refresh_log FOR SELECT USING (true);

-- Service role (used by cron) bypasses RLS, so no insert policy needed
