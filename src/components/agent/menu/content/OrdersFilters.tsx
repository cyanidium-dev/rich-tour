"use client";

import { useEffect, useMemo, useState } from "react";
import { useFilter } from "@react-aria/i18n";
import { CalendarDate } from "@internationalized/date";
import { ComboBox, DateField, DateRangePicker, Input, Label, ListBox, RangeCalendar } from "@heroui/react";

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

interface OptionItem {
  key: string;
  label: string;
}

export interface AgentFilterOption {
  id: string;
  name: string;
}

interface OrdersFiltersProps {
  filters: OrdersFiltersState;
  onChange: (filters: OrdersFiltersState) => void;
  showAgentFilter?: boolean;
  showDebtFilter?: boolean;
  agentOptions?: AgentFilterOption[];
  statusOptions?: OptionItem[];
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

function FilterComboBox({
  options,
  selectedKey,
  onChange,
  placeholder,
}: {
  options: OptionItem[];
  selectedKey: string | null;
  onChange: (value: string | null) => void;
  placeholder: string;
}) {
  const { startsWith } = useFilter({ sensitivity: "base" });
  const [inputValue, setInputValue] = useState(
    options.find((item) => item.key === selectedKey)?.label ?? ""
  );

  useEffect(() => {
    setInputValue(options.find((item) => item.key === selectedKey)?.label ?? "");
  }, [options, selectedKey]);

  return (
    <ComboBox
      aria-label={placeholder}
      className="w-[300px] shrink-0 lg:w-[245px]"
      defaultFilter={startsWith}
      selectedKey={selectedKey}
      inputValue={inputValue}
      onInputChange={(value) => {
        setInputValue(value);
        if (!value) onChange(null);
      }}
      onSelectionChange={(key) => {
        const next = key === null ? null : String(key);
        setInputValue(options.find((item) => item.key === next)?.label ?? "");
        onChange(next);
      }}
    >
      <ComboBox.InputGroup className="h-12 rounded-full border border-black bg-white px-5 shadow-none focus-within:outline-2 focus-within:outline-main">
        <Input placeholder={placeholder} className="min-w-0 flex-1 border-0 bg-transparent text-14reg text-black shadow-none outline-none placeholder:text-black/60" />
        {selectedKey && (
          <button
            type="button"
            aria-label={`Очистити ${placeholder.toLowerCase()}`}
            className="px-1 text-black/60 hover:text-black focus-visible:outline-2 focus-visible:outline-main"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => { setInputValue(""); onChange(null); }}
          >
            ×
          </button>
        )}
        <ComboBox.Trigger className="shrink-0 bg-transparent text-black" aria-label={`Відкрити ${placeholder.toLowerCase()}`}>
          <SelectIcon />
        </ComboBox.Trigger>
      </ComboBox.InputGroup>
      <ComboBox.Popover className="rounded-[20px] border border-black bg-white shadow-none">
        <ListBox>
          {options.map((item) => (
            <ListBox.Item key={item.key} id={item.key} textValue={item.label} className="text-14reg">
              <Label>{item.label}</Label>
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </ComboBox.Popover>
    </ComboBox>
  );
}

const toCalendarDate = (date: Date) =>
  new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());

const toDate = (value: { year: number; month: number; day: number }) =>
  new Date(value.year, value.month - 1, value.day);

export default function OrdersFilters({
  filters,
  onChange,
  showAgentFilter = false,
  showDebtFilter = true,
  agentOptions = [],
  statusOptions = defaultStatusOptions,
}: OrdersFiltersProps) {
  const agentItems = useMemo(
    () => agentOptions.map((agent) => ({ key: agent.id, label: agent.name })),
    [agentOptions]
  );

  return (
    <div id="orders-filters" className="flex flex-col items-center gap-4 lg:flex-row lg:flex-wrap">
      <div className="w-[300px] shrink-0">
        <SearchInput value={filters.search} onChange={(search) => onChange({ ...filters, search })} />
      </div>
      {showAgentFilter && (
        <FilterComboBox options={agentItems} selectedKey={filters.agentId} onChange={(agentId) => onChange({ ...filters, agentId })} placeholder="Обрати агента" />
      )}
      <FilterComboBox options={statusOptions} selectedKey={filters.status} onChange={(status) => onChange({ ...filters, status })} placeholder="Статус заявки" />
      {showDebtFilter && (
        <FilterComboBox options={debtOptions} selectedKey={filters.hasDebt} onChange={(hasDebt) => onChange({ ...filters, hasDebt: hasDebt as PaidFilter })} placeholder="Залишок до сплати" />
      )}
      <DateRangePicker
        aria-label="Період туру"
        className="w-[300px] lg:w-[280px]"
        value={filters.period.from && filters.period.to ? {
          start: toCalendarDate(filters.period.from),
          end: toCalendarDate(filters.period.to),
        } : null}
        onChange={(range) => onChange({
          ...filters,
          period: {
            from: range?.start ? toDate(range.start) : null,
            to: range?.end ? toDate(range.end) : null,
          },
        })}
      >
        <DateField.Group className="h-12 rounded-full border border-black bg-white px-3 shadow-none focus-within:outline-2 focus-within:outline-main">
          <DateField.InputContainer className="min-w-0 flex-1 text-12reg">
            <DateField.Input slot="start">{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
            <DateRangePicker.RangeSeparator />
            <DateField.Input slot="end">{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
          </DateField.InputContainer>
          <DateField.Suffix className="shrink-0">
            {(filters.period.from || filters.period.to) && (
              <button type="button" aria-label="Очистити період" className="px-1 text-black/60 hover:text-black focus-visible:outline-2 focus-visible:outline-main" onClick={() => onChange({ ...filters, period: { from: null, to: null } })}>×</button>
            )}
            <DateRangePicker.Trigger><DateRangePicker.TriggerIndicator /></DateRangePicker.Trigger>
          </DateField.Suffix>
        </DateField.Group>
        <DateRangePicker.Popover>
          <RangeCalendar aria-label="Період туру">
            <RangeCalendar.Header>
              <RangeCalendar.NavButton slot="previous" />
              <RangeCalendar.Heading />
              <RangeCalendar.NavButton slot="next" />
            </RangeCalendar.Header>
            <RangeCalendar.Grid>
              <RangeCalendar.GridHeader>{(day) => <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>}</RangeCalendar.GridHeader>
              <RangeCalendar.GridBody>{(date) => <RangeCalendar.Cell date={date} />}</RangeCalendar.GridBody>
            </RangeCalendar.Grid>
          </RangeCalendar>
        </DateRangePicker.Popover>
      </DateRangePicker>
    </div>
  );
}
