"use client";

import { Key } from "@react-types/shared";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useFilter } from "@react-aria/i18n";
import {
    Autocomplete,
    AutocompleteItem,
    DateRangePicker,
    MenuTriggerAction,
} from "@heroui/react";

import SearchInput from "./SearchInput";
import SelectIcon from "@/components/shared/icons/SelectIcon";

export type StatusFilter = string | null;
export type PaidFilter = "так" | "ні" | null;

export interface OrdersFiltersState {
    search: string;
    agentId: string | null;
    status: StatusFilter;
    hasDebt: PaidFilter;
    period: { from: Date | null; to: Date | null };
}

interface OrdersFiltersProps {
    filters: OrdersFiltersState;
    onChange: (filters: OrdersFiltersState) => void;
    showAgentFilter?: boolean;
    showDebtFilter?: boolean;
    agentOptions?: AgentFilterOption[];
    statusOptions?: OptionItem[];
}

interface OptionItem {
    key: string;
    label: string;
}

export interface AgentFilterOption {
    id: string;
    name: string;
}

interface AutocompleteState {
    selectedKey: Key | null;
    inputValue: string;
    items: OptionItem[];
}

const defaultStatusOptions: OptionItem[] = [
    { key: "Нова заявка", label: "Нова заявка" },
    { key: "В роботі", label: "В роботі" },
    { key: "Дані внесено", label: "Дані внесено" },
    { key: "Відправлено на підтвердження", label: "Відправлено на підтвердження" },
    { key: "Відмова від заявки", label: "Відмова від заявки" },
    { key: "Підтверджено. Чекаю оплату завдатку", label: "Підтверджено. Чекаю оплату завдатку" },
    { key: "Оплачено завдаток", label: "Оплачено завдаток" },
    { key: "Оплата залишкової вартості туру", label: "Оплата залишкової вартості туру" },
    { key: "Відправлено на оплату", label: "Відправлено на оплату" },
    { key: "Повна оплата", label: "Повна оплата" },
    { key: "Тур завершено", label: "Тур завершено" },
    { key: "Кошти повернуто", label: "Кошти повернуто" },
];

const debtOptions: OptionItem[] = [
    { key: "так", label: "Так" },
    { key: "ні", label: "Ні" },
];

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

export default function OrdersFilters({
                                          filters,
                                          onChange,
                                          showAgentFilter = false,
                                          showDebtFilter = true,
                                          agentOptions = [],
                                          statusOptions = defaultStatusOptions,
                                      }: OrdersFiltersProps) {
    const { startsWith } = useFilter({ sensitivity: "base" });
    const agentItems = useMemo(
        () =>
            agentOptions.map((agent) => ({
                key: agent.id,
                label: agent.name,
            })),
        [agentOptions]
    );

    const [agentState, setAgentState] = useState<AutocompleteState>({
        selectedKey: null,
        inputValue: "",
        items: agentItems,
    });

    const [statusState, setStatusState] = useState<AutocompleteState>({
        selectedKey: null,
        inputValue: "",
        items: statusOptions,
    });

    const [debtState, setDebtState] = useState<AutocompleteState>({
        selectedKey: null,
        inputValue: "",
        items: debtOptions,
    });

    useEffect(() => {
        setAgentState((state) => ({
            ...state,
            items: agentItems.filter((item) =>
                startsWith(item.label, state.inputValue)
            ),
        }));
    }, [agentItems, startsWith]);

    useEffect(() => {
        setStatusState((state) => ({
            ...state,
            items: statusOptions.filter((item) =>
                startsWith(item.label, state.inputValue)
            ),
        }));
    }, [startsWith, statusOptions]);

    const handleOpenChange = (
        isOpen: boolean,
        menuTrigger: MenuTriggerAction,
        state: AutocompleteState,
        setState: Dispatch<SetStateAction<AutocompleteState>>,
        items: OptionItem[]
    ) => {
        if (menuTrigger === "manual" && isOpen) {
            setState({ ...state, items });
        }
    };

    const handleInputChange = (
        value: string,
        state: AutocompleteState,
        setState: Dispatch<SetStateAction<AutocompleteState>>,
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
        setState: Dispatch<SetStateAction<AutocompleteState>>,
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
            className="flex flex-col lg:flex-row lg:flex-wrap gap-4 items-center"
        >
            <div className="w-[300px] shrink-0">
                <SearchInput
                    value={filters.search}
                    onChange={(value) =>
                        onChange({ ...filters, search: value })
                    }
                />
            </div>

            {showAgentFilter && (
                <PillWrapper width="w-[300px] lg:w-[245px]">
                    <Autocomplete
                        inputValue={agentState.inputValue}
                        items={agentState.items}
                        selectedKey={agentState.selectedKey}
                        onOpenChange={(isOpen, trigger) =>
                            handleOpenChange(
                                isOpen,
                                trigger,
                                agentState,
                                setAgentState,
                                agentItems
                            )
                        }
                        onInputChange={(value) =>
                            handleInputChange(
                                value,
                                agentState,
                                setAgentState,
                                agentItems
                            )
                        }
                        onSelectionChange={(key) => {
                            handleSelectionChange(
                                key,
                                setAgentState,
                                agentItems
                            );
                            onChange({
                                ...filters,
                                agentId: key ? String(key) : null,
                            });
                        }}
                        placeholder="Обрати агента"
                        isClearable
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
            )}

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
                    isClearable
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

            {showDebtFilter && (
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
                        isClearable
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
            )}

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
                endContent={
                    (filters.period.from || filters.period.to) && (
                        <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() =>
                                onChange({
                                    ...filters,
                                    period: { from: null, to: null },
                                })
                            }
                            className="
                w-8 h-8
                flex items-center justify-center
                rounded-full
                text-default-500
                hover:bg-default/40
                hover:text-black
                transition
            "
                            aria-label="Очистити період"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    )
                }
            />
        </div>
    );
}
