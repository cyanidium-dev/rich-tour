"use client";

import { Key } from "@react-types/shared";
import { useState } from "react";
import { useFilter } from "@react-aria/i18n";
import {
    Autocomplete,
    AutocompleteItem,
    DateRangePicker,
    MenuTriggerAction,
} from "@heroui/react";

import SearchInput from "./SearchInput";
import SelectIcon from "@/components/shared/icons/SelectIcon";

/* =======================
   TYPES
======================= */

export type StatusFilter =
    | "не почався"
    | "в процесі"
    | "завершений"
    | "відмінений"
    | null;

export type PaidFilter = "так" | "ні" | null;

export interface OrdersFiltersState {
    search: string;
    status: StatusFilter;
    hasDebt: PaidFilter;
    period: { from: Date | null; to: Date | null };
}

interface OrdersFiltersProps {
    filters: OrdersFiltersState;
    onChange: (filters: OrdersFiltersState) => void;
}

interface OptionItem {
    key: string;
    label: string;
}

/* =======================
   OPTIONS
======================= */

const statusOptions: OptionItem[] = [
    { key: "не почався", label: "Не почався" },
    { key: "в процесі", label: "В процесі" },
    { key: "завершений", label: "Завершений" },
    { key: "відмінений", label: "Відмінений" },
];

const debtOptions: OptionItem[] = [
    { key: "так", label: "Так" },
    { key: "ні", label: "Ні" },
];

/* =======================
   STYLES
======================= */

const PillWrapper = ({
                         children,
                         width,
                     }: {
    children: React.ReactNode;
    width: string;
}) => (
    <div
        className={`
      ${width}
      h-12
      rounded-full
      border border-black
      bg-white
      flex items-center
    `}
    >
        {children}
    </div>
);

const innerAutocomplete = {
    base: "w-full",
    inputWrapper: `
    h-12
    bg-transparent
    border-none
    shadow-none
    ring-0
    outline-none
    rounded-full
    data-[hover=true]:bg-transparent
    group-data-[focus=true]:bg-transparent
  `,
    input: "text-black text-14reg placeholder:text-black/60",
    selectorButton: "mr-3",
    popoverContent: "bg-white border border-black rounded-[20px] shadow-none",
};

const pillDateRange = {
    base: "w-[300px] lg:w-[280px]",
    inputWrapper: `
    h-12
    px-5
    rounded-full
    bg-white
    border border-black
    shadow-none
    ring-0
    outline-none
  `,
};

/* =======================
   COMPONENT
======================= */

export default function OrdersFilters({ filters, onChange }: OrdersFiltersProps) {
    const { startsWith } = useFilter({ sensitivity: "base" });

    const [statusState, setStatusState] = useState({
        selectedKey: null as Key | null,
        inputValue: "",
        items: statusOptions,
    });

    const [debtState, setDebtState] = useState({
        selectedKey: null as Key | null,
        inputValue: "",
        items: debtOptions,
    });

    const handleOpenChange = (
        isOpen: boolean,
        menuTrigger: MenuTriggerAction,
        state: typeof statusState,
        setState: typeof setStatusState,
        items: OptionItem[]
    ) => {
        if (menuTrigger === "manual" && isOpen) {
            setState({ ...state, items });
        }
    };

    const handleInputChange = (
        value: string,
        state: typeof statusState,
        setState: typeof setStatusState,
        items: OptionItem[]
    ) => {
        setState({
            inputValue: value,
            selectedKey: value === "" ? null : state.selectedKey,
            items: items.filter((item) => startsWith(item.label, value)),
        });
    };

    const handleSelectionChange = (
        key: Key | null,
        setState: typeof setStatusState,
        items: OptionItem[]
    ) => {
        const selectedItem = items.find((i) => i.key === key);
        setState({
            inputValue: selectedItem?.label || "",
            selectedKey: key,
            items,
        });
    };

    return (
        <div
            id="orders-filters"
            style={{
                ["--heroui-default-100" as any]: "0 0% 100%",
                ["--heroui-default-200" as any]: "0 0% 100%",
                ["--heroui-default-100-opacity" as any]: "1",
                ["--heroui-default-200-opacity" as any]: "1",
            }}
            className="flex flex-col lg:flex-row gap-4 items-center"
        >
            {/* 🔍 SEARCH */}
            <div className="w-[300px] shrink-0">
                <SearchInput
                    value={filters.search}
                    onChange={(value) =>
                        onChange({ ...filters, search: value })
                    }
                />
            </div>

            {/* 📌 STATUS */}
            <PillWrapper width="w-[300px] lg:w-[245px]">
                <Autocomplete
                    inputValue={statusState.inputValue}
                    items={statusState.items}
                    selectedKey={statusState.selectedKey}
                    onOpenChange={(isOpen, trigger) =>
                        handleOpenChange(
                            isOpen,
                            trigger,
                            statusState,
                            setStatusState,
                            statusOptions
                        )
                    }
                    onInputChange={(value) =>
                        handleInputChange(
                            value,
                            statusState,
                            setStatusState,
                            statusOptions
                        )
                    }
                    onSelectionChange={(key) => {
                        handleSelectionChange(
                            key,
                            setStatusState,
                            statusOptions
                        );
                        onChange({
                            ...filters,
                            status: key as StatusFilter,
                        });
                    }}
                    placeholder="Статус заявки"
                    isClearable={false}
                    size="sm"
                    selectorIcon={<SelectIcon />}
                    classNames={innerAutocomplete}
                >
                    {(item) => (
                        <AutocompleteItem
                            key={item.key}
                            className="text-14reg"
                        >
                            {item.label}
                        </AutocompleteItem>
                    )}
                </Autocomplete>
            </PillWrapper>

            {/* 💰 DEBT */}
            <PillWrapper width="w-[300px] lg:w-[245px]">
                <Autocomplete
                    inputValue={debtState.inputValue}
                    items={debtState.items}
                    selectedKey={debtState.selectedKey}
                    onOpenChange={(isOpen, trigger) =>
                        handleOpenChange(
                            isOpen,
                            trigger,
                            debtState,
                            setDebtState,
                            debtOptions
                        )
                    }
                    onInputChange={(value) =>
                        handleInputChange(
                            value,
                            debtState,
                            setDebtState,
                            debtOptions
                        )
                    }
                    onSelectionChange={(key) => {
                        handleSelectionChange(
                            key,
                            setDebtState,
                            debtOptions
                        );
                        onChange({
                            ...filters,
                            hasDebt: key as PaidFilter,
                        });
                    }}
                    placeholder="Залишок до сплати"
                    isClearable={false}
                    size="sm"
                    selectorIcon={<SelectIcon />}
                    classNames={innerAutocomplete}
                >
                    {(item) => (
                        <AutocompleteItem
                            key={item.key}
                            className="text-14reg"
                        >
                            {item.label}
                        </AutocompleteItem>
                    )}
                </Autocomplete>
            </PillWrapper>

            {/* 📅 PERIOD */}
            <DateRangePicker
                size="sm"
                placeholder="Період туру"
                classNames={pillDateRange}
                value={
                    filters.period.from && filters.period.to
                        ? {
                            start: filters.period.from,
                            end: filters.period.to,
                        }
                        : null
                }
                onChange={(range) =>
                    onChange({
                        ...filters,
                        period: {
                            from: range?.start ?? null,
                            to: range?.end ?? null,
                        },
                    })
                }
            />
        </div>
    );
}
