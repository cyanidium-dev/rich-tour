"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useFilter } from "@react-aria/i18n";
import { ComboBox, Input, Label, ListBox } from "@heroui/react";
import Link from "next/link";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import SearchIcon from "@/components/shared/icons/SearchIcon";
import SelectIcon from "@/components/shared/icons/SelectIcon";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import { months, searchHref, type SearchValues } from "./searchModel";

interface SearchFormProps {
  variant?: "red" | "black";
  countries: SearchOption[];
  initialCountry?: string;
  initialMonth?: string;
}

export type SearchOption = { key: string; label: string };

export default function SearchForm({
  variant = "black",
  countries,
  initialCountry,
  initialMonth,
}: SearchFormProps) {
  const selectedCountry = countries.find((item) => item.key === initialCountry);
  const selectedMonth = months.find((item) => item.key === initialMonth);
  const { control, setValue } = useForm<SearchValues>({
    defaultValues: {
      country: selectedCountry?.key ?? null,
      month: selectedMonth?.key ?? null,
    },
    values: {
      country: selectedCountry?.key ?? null,
      month: selectedMonth?.key ?? null,
    },
  });
  const country = useWatch({ control, name: "country" });
  const month = useWatch({ control, name: "month" });
  const [countryInput, setCountryInput] = useState(selectedCountry?.label ?? "");
  const [monthInput, setMonthInput] = useState(selectedMonth?.label ?? "");

  const [isInputOpen, setIsInputOpen] = useState(false);

  const { startsWith } = useFilter({ sensitivity: "base" });

  const searchLink = searchHref({ country, month });

  return (
    <AnimatedWrapper
      animation={fadeInAnimation({
        y: 30,
        delay: variant === "black" ? 0.8 : 0,
      })}
      className={`flex flex-col md:grid md:grid-cols-3 md:items-center gap-3 max-w-[325px] ${variant === "black" ? "md:max-w-[592px]" : "md:max-w-[550px]"} py-[18px] md:p-[13px] px-[14px] mx-auto
     ${variant === "black" ? "md:bg-black rounded-full" : "bg-main rounded-[40px]"}`}
    >
      <div
        className={`${
          variant === "black"
            ? "flex gap-x-3 py-3 px-[13.5px] md:p-0 bg-black md:bg-transparent"
            : "flex flex-col md:flex-row gap-3 bg-main"
        } w-full rounded-full text-14reg md:col-span-2`}
      >
        <ComboBox
          className="min-w-0 flex-1"
          defaultFilter={startsWith}
          inputValue={countryInput}
          selectedKey={country}
          onOpenChange={setIsInputOpen}
          onInputChange={(value) => {
            setCountryInput(value);
            if (!value) setValue("country", null);
          }}
          onSelectionChange={(key) => {
            const next = key === null ? null : String(key);
            setValue("country", next);
            setCountryInput(countries.find((item) => item.key === next)?.label ?? "");
          }}
        >
          <Label className={variant === "black" ? "sr-only" : "text-white"}>Країна</Label>
          <ComboBox.InputGroup
            className={
              variant === "black"
                ? "h-12 md:h-[52px] w-full rounded-full border-0 bg-white px-[18px] shadow-none"
                : "rounded-full border-0 bg-transparent shadow-none"
            }
          >
            <Input
              placeholder={variant === "black" ? "Країна" : undefined}
              className={
                variant === "black"
                  ? "min-w-0 h-full border-0 bg-transparent p-0 text-14reg text-black placeholder:text-black hover:bg-transparent focus:bg-transparent focus:ring-0"
                  : "min-w-0 bg-transparent text-white placeholder:text-white/70"
              }
            />
            <ComboBox.Trigger
              className={variant === "black" ? "end-[18px] p-0 text-black" : "text-white"}
            >
              <SearchIcon />
            </ComboBox.Trigger>
          </ComboBox.InputGroup>
          <ComboBox.Popover className="bg-white text-black">
            <ListBox>
              {countries.map((item) => (
                <ListBox.Item key={item.key} id={item.key} textValue={item.label}>
                  <Label>{item.label}</Label>
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </ComboBox.Popover>
        </ComboBox>

        <ComboBox
          className="min-w-0 flex-1"
          defaultFilter={startsWith}
          inputValue={monthInput}
          selectedKey={month}
          onOpenChange={setIsInputOpen}
          onInputChange={(value) => {
            setMonthInput(value);
            if (!value) setValue("month", null);
          }}
          onSelectionChange={(key) => {
            const next = key === null ? null : String(key);
            setValue("month", next);
            setMonthInput(months.find((item) => item.key === next)?.label ?? "");
          }}
        >
          <Label className={variant === "black" ? "sr-only" : "text-white"}>Місяць</Label>
          <ComboBox.InputGroup
            className={
              variant === "black"
                ? "h-12 md:h-[52px] w-full rounded-full border-0 bg-white px-[18px] shadow-none"
                : "rounded-full border-0 bg-transparent shadow-none"
            }
          >
            <Input
              placeholder={variant === "black" ? "Місяць" : undefined}
              className={
                variant === "black"
                  ? "min-w-0 h-full border-0 bg-transparent p-0 text-14reg text-black placeholder:text-black hover:bg-transparent focus:bg-transparent focus:ring-0"
                  : "min-w-0 bg-transparent text-white placeholder:text-white/70"
              }
            />
            <ComboBox.Trigger
              className={variant === "black" ? "end-[18px] p-0 text-black" : "text-white"}
            >
              <SelectIcon />
            </ComboBox.Trigger>
          </ComboBox.InputGroup>
          <ComboBox.Popover className="bg-white text-black">
            <ListBox>
              {months.map((item) => (
                <ListBox.Item
                  key={item.key}
                  id={item.key}
                  textValue={item.label}
                  className="text-[10px]"
                >
                  <Label>{item.label}</Label>
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </ComboBox.Popover>
        </ComboBox>
      </div>

      <Link
        href={searchLink}
        className={`relative overflow-hidden flex items-center justify-center w-full h-12 md:h-[52px] py-[10px] px-[14.5px]
          rounded-full border-[1.5px] border-white bg-transparent text-white text-14med
          before:content-[""] before:absolute before:z-10 before:top-0 before:left-0 before:rounded-full
          before:w-0 before:h-full before:bg-white before:duration-700 before:ease-in-out
          xl:hover:before:w-full xl:hover:text-black focus-visible:before:w-full focus-visible:text-black transition duration-300 ease-in-out active:scale-95 ${
            isInputOpen ? "pointer-events-none" : ""
          }`}
      >
        <span className="relative z-20">Пошук</span>
      </Link>
    </AnimatedWrapper>
  );
}
