"use client";

import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    ReactNode,
} from "react";
import axios from "axios";

type Currency = "EUR" | "UAH";

type CurrencyContextType = {
    selected: Currency;
    loading: boolean;
    setSelected: (currency: Currency) => void;
    convert: (amount: number) => number;
    rate: number | null;
};

const CurrencyContext = createContext<CurrencyContextType | null>(null);

const SELECTED_STORAGE_KEY = "selected_currency";

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const rateRef = useRef<number | null>(null);
    const [selected, setSelectedState] = useState<Currency>("EUR");
    const [loading, setLoading] = useState(true);

    const setSelected = (currency: Currency) => {
        setSelectedState(currency);
        localStorage.setItem(SELECTED_STORAGE_KEY, currency);
    };

    useEffect(() => {
        const stored = localStorage.getItem(
            SELECTED_STORAGE_KEY
        ) as Currency | null;

        if (stored) {
            setSelectedState(stored);
        }

        // загрузка курса
        const fetchRate = async () => {
            try {
                const { data } = await axios.get("/api/currency");
                rateRef.current = data.eur;
            } catch (error) {
                console.error("Failed to fetch EUR/UAH", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRate();
    }, []);

    const convert = (amount: number) => {
        if (!rateRef.current) return amount;
        if(selected === "EUR") return amount;

        return Math.round(amount * rateRef.current);
    };

    return (
        <CurrencyContext.Provider
            value={{
                selected,
                loading,
                setSelected,
                convert,
                rate: rateRef.current,
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
