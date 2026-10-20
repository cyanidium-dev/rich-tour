"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { CURRENCY_REFRESH_MS, isValidRate } from "@/lib/currency/rate";

type Currency = "EUR" | "USD";

type CurrencyContextType = {
  selected: Currency;
  loading: boolean;
  setSelected: (currency: Currency) => void;
  convert: (amount: number) => number;
  rate: number | null;
  usdRate: number | null;
};

const CurrencyContext = createContext<CurrencyContextType | null>(null);

const SELECTED_STORAGE_KEY = "selected_currency";
const RATE_STORAGE_KEY = "last_eur_uah_rate";
const USD_RATE_STORAGE_KEY = "last_usd_uah_rate";

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [preferred, setPreferred] = useState<Currency>("EUR");
  const [rate, setRate] = useState<number | null>(null);
  const [usdRate, setUsdRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const selected = preferred === "USD" && isValidRate(rate) && isValidRate(usdRate) ? "USD" : "EUR";

  const setSelected = (currency: Currency) => {
    if (currency === "USD" && (!isValidRate(rate) || !isValidRate(usdRate))) return;
    setPreferred(currency);
    try {
      localStorage.setItem(SELECTED_STORAGE_KEY, currency);
    } catch {
      // Currency selection still works if browser storage is unavailable.
    }
  };

  useEffect(() => {
    let active = true;
    try {
      const storedRate = Number(localStorage.getItem(RATE_STORAGE_KEY));
      if (isValidRate(storedRate)) setRate(storedRate);
      const storedUsdRate = Number(localStorage.getItem(USD_RATE_STORAGE_KEY));
      if (isValidRate(storedUsdRate)) setUsdRate(storedUsdRate);
      const storedCurrency = localStorage.getItem(SELECTED_STORAGE_KEY);
      if (storedCurrency === "EUR" || storedCurrency === "USD") setPreferred(storedCurrency);
    } catch {
      // The server-backed rate can still be loaded without browser storage.
    }

    const refreshRate = async () => {
      try {
        const response = await fetch("/api/currency", { cache: "no-store" });
        if (!response.ok) throw new Error(`Currency API returned ${response.status}`);
        const data: unknown = await response.json();
        const nextRate = (data as { eur?: unknown })?.eur;
        const nextUsdRate = (data as { usd?: unknown })?.usd;
        if (!isValidRate(nextRate) || !isValidRate(nextUsdRate)) {
          throw new Error("Currency API returned invalid rates");
        }
        if (active) {
          setRate(nextRate);
          setUsdRate(nextUsdRate);
          try {
            localStorage.setItem(RATE_STORAGE_KEY, String(nextRate));
            localStorage.setItem(USD_RATE_STORAGE_KEY, String(nextUsdRate));
          } catch {
            // The in-memory rate remains available for this visit.
          }
        }
      } catch (error) {
        console.error("Failed to fetch currency rates", error);
      } finally {
        if (active) setLoading(false);
      }
    };

    void refreshRate();
    const interval = setInterval(() => void refreshRate(), CURRENCY_REFRESH_MS);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const convert = (amount: number) => {
    if (selected === "EUR" || !isValidRate(rate) || !isValidRate(usdRate)) return amount;
    return Math.round((amount * rate * 100) / usdRate) / 100;
  };

  return (
    <CurrencyContext.Provider
      value={{
        selected,
        loading,
        setSelected,
        convert,
        rate,
        usdRate,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used inside CurrencyProvider");
  }
  return ctx;
}
