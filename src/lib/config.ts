// Indicator definitions for the dashboard

export const DAILY_TICKERS = [
  { ticker: "BZ=F", name: "Brent Crude", color: "#F59E0B", unit: "USD/bbl", prefix: "$" },
  { ticker: "PHP=X", name: "USD/PHP", color: "#3B82F6", unit: "PHP", prefix: "₱" },
  { ticker: "PSEI.PS", name: "PSEi Index", color: "#10B981", unit: "pts", prefix: "" },
  { ticker: "^VIX", name: "VIX", color: "#EF4444", unit: "pts", prefix: "" },
] as const;

export const IMF_INDICATORS = [
  { code: "PCPI_IX", name: "Consumer Price Index", unit: "Index", frequency: "monthly" },
  { code: "FILR_PA", name: "Lending Rate", unit: "%", frequency: "monthly" },
  { code: "FIGB_PA", name: "Govt Bond Yield", unit: "%", frequency: "monthly" },
  { code: "ENDA_XDC_USD_RATE", name: "Exchange Rate (IMF)", unit: "PHP/USD", frequency: "monthly" },
  { code: "RAFA_USD", name: "Reserve Assets", unit: "USD millions", frequency: "monthly" },
  { code: "TMG_CIF_USD", name: "Goods Imports", unit: "USD millions", frequency: "monthly" },
  { code: "TXG_FOB_USD", name: "Goods Exports", unit: "USD millions", frequency: "monthly" },
] as const;

export const WORLDBANK_INDICATORS = [
  { code: "BX.TRF.PWKR.CD.DT", name: "Personal Remittances Received", unit: "USD", frequency: "annual" },
  { code: "FP.CPI.TOTL.ZG", name: "Inflation (annual %)", unit: "%", frequency: "annual" },
  { code: "NY.GDP.MKTP.KD.ZG", name: "GDP Growth (annual %)", unit: "%", frequency: "annual" },
  { code: "NE.IMP.GNFS.ZS", name: "Imports (% of GDP)", unit: "%", frequency: "annual" },
  { code: "BN.CAB.XOKA.GD.ZS", name: "Current Account (% of GDP)", unit: "%", frequency: "annual" },
] as const;
