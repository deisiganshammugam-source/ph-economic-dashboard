// Indicator definitions for the dashboard

export const DAILY_TICKERS = [
  { ticker: "BZ=F", name: "Brent Crude", color: "#F59E0B", unit: "USD/bbl", prefix: "$" },
  { ticker: "PHP=X", name: "USD/PHP", color: "#3B82F6", unit: "PHP", prefix: "₱" },
  { ticker: "PSEI.PS", name: "PSEi Index", color: "#10B981", unit: "pts", prefix: "" },
  { ticker: "^VIX", name: "VIX", color: "#EF4444", unit: "pts", prefix: "" },
] as const;

// IMF DataMapper API indicators (annual, includes WEO forecasts)
export const IMF_INDICATORS = [
  { code: "PCPIPCH", name: "CPI Inflation (%)", unit: "%", frequency: "annual" },
  { code: "NGDP_RPCH", name: "Real GDP Growth (%)", unit: "%", frequency: "annual" },
  { code: "BCA_NGDPD", name: "Current Account (% of GDP)", unit: "%", frequency: "annual" },
  { code: "GGXWDG_NGDP", name: "Govt Debt (% of GDP)", unit: "%", frequency: "annual" },
  { code: "LUR", name: "Unemployment Rate (%)", unit: "%", frequency: "annual" },
] as const;

export const WORLDBANK_INDICATORS = [
  { code: "BX.TRF.PWKR.CD.DT", name: "Personal Remittances Received", unit: "USD", frequency: "annual" },
  { code: "FP.CPI.TOTL.ZG", name: "Inflation (annual %)", unit: "%", frequency: "annual" },
  { code: "NY.GDP.MKTP.KD.ZG", name: "GDP Growth (annual %)", unit: "%", frequency: "annual" },
  { code: "NE.IMP.GNFS.ZS", name: "Imports (% of GDP)", unit: "%", frequency: "annual" },
  { code: "BN.CAB.XOKA.GD.ZS", name: "Current Account (% of GDP)", unit: "%", frequency: "annual" },
] as const;
