"use client";

import { Key } from "@react-types/shared";
import { useState } from "react";
import { useFilter } from "@react-aria/i18n";
import {
  Autocomplete,
  AutocompleteItem,
  MenuTriggerAction,
} from "@heroui/react";
import Link from "next/link";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import { countries, months } from "../../home/hero/mockedData";
import MainButton from "@/components/shared/buttons/MainButton";
import SearchIcon from "@/components/shared/icons/SearchIcon";
import SelectIcon from "@/components/shared/icons/SelectIcon";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";

interface SearchFormProps {
  variant?: "red" | "black";
}

interface FieldState {
  selectedKey: Key | null;
  inputValue: string;
  items: { key: Key; label: string }[];
}

//@ts-expect-error
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

export default function SearchForm({ variant = "black" }: SearchFormProps) {
  const [countryFieldState, setCountryFieldState] = useState<FieldState>({
    selectedKey: null,
    inputValue: "",
    items: countries,
  });
  console.log(countryFieldState)
  const [monthFieldState, setMonthFieldState] = useState<FieldState>({
    selectedKey: null,
    inputValue: "",
    items: months,
  });

  const [isInputOpen, setIsInputOpen] = useState(false);

  const { startsWith } = useFilter({ sensitivity: "base" });

  const handleInputChange = (
    value: string,
    fieldState: FieldState,
    setFieldState: React.Dispatch<React.SetStateAction<FieldState>>,
    items: { key: Key; label: string }[]
  ) => {
    setFieldState({
      inputValue: value,
      selectedKey: value === "" ? null : fieldState.selectedKey,
      items: items.filter((item) => startsWith(item.label, value)),
    });
  };

  const handleSelectionChange = (
    key: Key | null,
    fieldState: FieldState,
    setFieldState: React.Dispatch<React.SetStateAction<FieldState>>,
    items: { key: Key; label: string }[]
  ) => {
    const selectedItem = items.find((option) => option.key === key);
    setFieldState({
      inputValue: selectedItem?.label || "",
      selectedKey: key,
      items: items.filter((item) =>
        startsWith(item.label, selectedItem?.label || "")
      ),
    });
  };

  const handleOpenChange = (
    isOpen: boolean,
    menuTrigger: MenuTriggerAction,
    fieldState: FieldState,
    setFieldState: React.Dispatch<React.SetStateAction<FieldState>>,
    items: { key: Key; label: string }[]
  ) => {
    if (menuTrigger === "manual" && isOpen) {
      setFieldState({
        inputValue: fieldState.inputValue,
        selectedKey: fieldState.selectedKey,
        items,
      });
    }
    setTimeout(() => {
      setIsInputOpen(isOpen);
    }, 100);
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
        <Autocomplete
          inputValue={countryFieldState.inputValue}
          items={countryFieldState.items}
          selectedKey={countryFieldState.selectedKey}
          onOpenChange={(isOpen, menuTrigger) =>
            handleOpenChange(
              isOpen,
              menuTrigger,
              countryFieldState,
              setCountryFieldState,
              countries
            )
          }
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
              countryFieldState,
              setCountryFieldState,
              countries
            )
          }
          isClearable={false}
          label="Країна"
          radius="full"
          size="sm"
          selectorIcon={<SearchIcon />}
          disableSelectorIconRotation
          classNames={{
            selectorButton: "mt-1 mr-1",
          }}
        >
          {(item) => (
            <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
          )}
        </Autocomplete>

        <Autocomplete
          inputValue={monthFieldState.inputValue}
          items={monthFieldState.items}
          selectedKey={monthFieldState.selectedKey}
          onOpenChange={(isOpen, menuTrigger) =>
            handleOpenChange(
              isOpen,
              menuTrigger,
              monthFieldState,
              setMonthFieldState,
              months
            )
          }
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
              monthFieldState,
              setMonthFieldState,
              months
            )
          }
          isClearable={false}
          label="Місяць"
          radius="full"
          size="sm"
          selectorIcon={<SelectIcon />}
          classNames={{ selectorButton: "mt-1 mr-1" }}
        >
          {(item) => (
            <AutocompleteItem key={item.key} className="text-[10px]">
              {item.label}
            </AutocompleteItem>
          )}
        </Autocomplete>
      </div>

      <Link
        href={searchLink}
        className={`block w-full md:w-[calc(33.3%-6px)] ${
          isInputOpen ? "pointer-events-none" : ""
        }`}
      >
        <MainButton variant="ghost white" className="w-full h-12 text-14med">
          Пошук
        </MainButton>
      </Link>
    </AnimatedWrapper>
  );
}
