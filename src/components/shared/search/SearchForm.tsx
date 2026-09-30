"use client";

import { useState } from "react";
import { useFilter } from "@react-aria/i18n";
import {
  ComboBox,
  Input,
  Label,
  ListBox,
} from "@heroui/react";
import Link from "next/link";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import SearchIcon from "@/components/shared/icons/SearchIcon";
import SelectIcon from "@/components/shared/icons/SelectIcon";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";

interface SearchFormProps {
  variant?: "red" | "black";
  countries: SearchOption[];
  initialCountry?: string;
  initialMonth?: string;
}

export type SearchOption = {key: string; label: string};

export const months: SearchOption[] = [
  {label: "Січень", key: "01"},
  {label: "Лютий", key: "02"},
  {label: "Березень", key: "03"},
  {label: "Квітень", key: "04"},
  {label: "Травень", key: "05"},
  {label: "Червень", key: "06"},
  {label: "Липень", key: "07"},
  {label: "Серпень", key: "08"},
  {label: "Вересень", key: "09"},
  {label: "Жовтень", key: "10"},
  {label: "Листопад", key: "11"},
  {label: "Грудень", key: "12"},
];

interface FieldState {
  selectedKey: string | null;
  inputValue: string;
}

const createSerchLink = ({selectedKey: country}, {selectedKey: month}) => {
  let searchLink = "/search";
  if(country && month) {
    searchLink += `?country=${country}&month=${month}`;
  } else if(country && !month) {
    searchLink += `?country=${country}`;
  } else if(!country && month) {
    searchLink += `?month=${month}`;
  }
  return searchLink;
}

export default function SearchForm({
  variant = "black",
  countries,
  initialCountry,
  initialMonth,
}: SearchFormProps) {
  const selectedCountry = countries.find((item) => item.key === initialCountry);
  const selectedMonth = months.find((item) => item.key === initialMonth);
  const [countryFieldState, setCountryFieldState] = useState<FieldState>({
    selectedKey: selectedCountry?.key ?? null,
    inputValue: selectedCountry?.label ?? "",
  });

  const [monthFieldState, setMonthFieldState] = useState<FieldState>({
    selectedKey: selectedMonth?.key ?? null,
    inputValue: selectedMonth?.label ?? "",
  });

  const [isInputOpen, setIsInputOpen] = useState(false);

  const { startsWith } = useFilter({ sensitivity: "base" });

  const handleInputChange = (
    value: string,
    fieldState: FieldState,
    setFieldState: React.Dispatch<React.SetStateAction<FieldState>>,
    items: SearchOption[]
  ) => {
    setFieldState({
      inputValue: value,
      selectedKey: value === "" ? null : fieldState.selectedKey,
    });
  };

  const handleSelectionChange = (
    key: string | number | null,
    setFieldState: React.Dispatch<React.SetStateAction<FieldState>>,
    items: SearchOption[]
  ) => {
    const selectedItem = items.find((option) => option.key === key);
    setFieldState({
      inputValue: selectedItem?.label || "",
      selectedKey: key === null ? null : String(key),
    });
  };

  const searchLink = createSerchLink(countryFieldState, monthFieldState);

  return (
    <AnimatedWrapper
      animation={fadeInAnimation({
        y: 30,
        delay: variant === "black" ? 0.8 : 0,
      })}
      className={`flex flex-col md:flex-row md:items-center gap-3 max-w-[325px] md:max-w-[550px] py-[18px] md:py-3 px-[14px] mx-auto
     ${
       variant === "black"
         ? "md:bg-black rounded-full"
         : "bg-main rounded-[40px]"
     }`}
    >
      <div
        className={`${
          variant === "black"
            ? "flex gap-x-3 py-3 px-[13.5px] md:p-0 bg-black md:bg-transparent"
            : "flex flex-col md:flex-row gap-3 bg-main"
        } w-full  rounded-full text-14reg md:w-[calc(66.7%-6px)]`}
      >
        <ComboBox
          className="min-w-0 flex-1"
          defaultFilter={startsWith}
          inputValue={countryFieldState.inputValue}
          selectedKey={countryFieldState.selectedKey}
          onOpenChange={setIsInputOpen}
          onInputChange={(value) =>
            handleInputChange(
              value,
              countryFieldState,
              setCountryFieldState,
              countries
            )
          }
          onSelectionChange={(key) =>
            handleSelectionChange(
              key,
              setCountryFieldState,
              countries
            )
          }
        >
          <Label className="text-white">Країна</Label>
          <ComboBox.InputGroup className="rounded-full border-0 bg-transparent shadow-none">
            <Input className="min-w-0 bg-transparent text-white placeholder:text-white/70" />
            <ComboBox.Trigger className="text-white"><SearchIcon /></ComboBox.Trigger>
          </ComboBox.InputGroup>
          <ComboBox.Popover className="bg-white text-black">
            <ListBox>
              {countries.map((item) => (
                <ListBox.Item key={item.key} id={item.key} textValue={item.label}>
                  <Label>{item.label}</Label><ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </ComboBox.Popover>
        </ComboBox>

        <ComboBox
          className="min-w-0 flex-1"
          defaultFilter={startsWith}
          inputValue={monthFieldState.inputValue}
          selectedKey={monthFieldState.selectedKey}
          onOpenChange={setIsInputOpen}
          onInputChange={(value) =>
            handleInputChange(
              value,
              monthFieldState,
              setMonthFieldState,
              months
            )
          }
          onSelectionChange={(key) =>
            handleSelectionChange(
              key,
              setMonthFieldState,
              months
            )
          }
        >
          <Label className="text-white">Місяць</Label>
          <ComboBox.InputGroup className="rounded-full border-0 bg-transparent shadow-none">
            <Input className="min-w-0 bg-transparent text-white placeholder:text-white/70" />
            <ComboBox.Trigger className="text-white"><SelectIcon /></ComboBox.Trigger>
          </ComboBox.InputGroup>
          <ComboBox.Popover className="bg-white text-black">
            <ListBox>
              {months.map((item) => (
                <ListBox.Item key={item.key} id={item.key} textValue={item.label} className="text-[10px]">
                  <Label>{item.label}</Label><ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </ComboBox.Popover>
        </ComboBox>
      </div>

      <Link
        href={searchLink}
        className={`relative overflow-hidden flex items-center justify-center w-full md:w-[calc(33.3%-6px)] h-12 py-[10px] px-[14.5px]
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
