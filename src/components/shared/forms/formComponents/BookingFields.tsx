"use client";

import { Checkbox, Label, ListBox, NumberField, Select } from "@heroui/react";
import type { ReactNode } from "react";

export function BookingDateSelect({
  options,
  value,
  onChange,
}: {
  options: { key: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select
      aria-label="Дата туру"
      placeholder="Виберіть дату"
      value={value || null}
      onChange={(key) => onChange(String(key ?? ""))}
    >
      <Select.Trigger className="h-10 rounded-[6px] border border-black bg-white px-4 shadow-none hover:bg-white focus-visible:outline-2 focus-visible:outline-main">
        <Select.Value className="text-10reg text-black lg:text-12reg" />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover className="rounded-[6px] border border-black bg-white shadow-none">
        <ListBox className="text-10reg font-normal text-black lg:text-12reg">
          {options.map((option) => (
            <ListBox.Item key={option.key} id={option.key} textValue={option.label}>
              <Label>{option.label}</Label>
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}

export function BookingTravelerCount({
  value,
  onChange,
}: {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
}) {
  return (
    <NumberField aria-label="Кількість туристів" minValue={1} value={value} onChange={onChange}>
      <NumberField.Group className="h-10 rounded-[6px] border border-black bg-white px-4 shadow-none focus-within:outline-2 focus-within:outline-main">
        <NumberField.Input
          placeholder="Кількість туристів"
          className="h-full w-full bg-transparent text-10reg shadow-none outline-none lg:text-12reg"
        />
      </NumberField.Group>
    </NumberField>
  );
}

export function BookingCheckbox({
  isSelected,
  onChange,
  children,
  emphasized = false,
}: {
  isSelected: boolean;
  onChange: (value: boolean) => void;
  children: ReactNode;
  emphasized?: boolean;
}) {
  return (
    <Checkbox isSelected={isSelected} onChange={onChange} className="text-black">
      <Checkbox.Content className={`text-[12px] leading-[120%] ${emphasized ? "font-semibold" : "font-normal"}`}>
        <Checkbox.Control className="size-4 rounded-sm border border-black bg-white data-[selected=true]:border-main data-[selected=true]:bg-main">
          <Checkbox.Indicator />
        </Checkbox.Control>
        {children}
      </Checkbox.Content>
    </Checkbox>
  );
}
