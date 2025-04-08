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
import { countries, months } from "./mockedData";
import MainButton from "@/components/shared/buttons/MainButton";
import SearchIcon from "@/components/shared/icons/SearchIcon";
import SelectIcon from "@/components/shared/icons/SelectIcon";

interface FieldState {
  selectedKey: Key | null;
  inputValue: string;
  items: typeof countries;
}

export default function Search() {
  const [countryFieldState, setCountryFieldState] = useState<FieldState>({
    selectedKey: "",
    inputValue: "",
    items: countries,
  });

  const [monthFieldState, setMonthFieldState] = useState<FieldState>({
    selectedKey: "",
    inputValue: "",
    items: months,
  });

  const { startsWith } = useFilter({ sensitivity: "base" });

  const onCountrySelectionChange = (key: Key | null) => {
    setCountryFieldState((prevState) => {
      const selectedItem = prevState.items.find((option) => option.key === key);

      return {
        inputValue: selectedItem?.label || "",
        selectedKey: key,
        items: countries.filter((item) =>
          startsWith(item.label, selectedItem?.label || "")
        ),
      };
    });
  };

  const onCountryInputChange = (value: string) => {
    setCountryFieldState((prevState) => ({
      inputValue: value,
      selectedKey: value === "" ? null : prevState.selectedKey,
      items: countries.filter((item) => startsWith(item.label, value)),
    }));
  };

  const onCountryOpenChange = (
    isOpen: boolean,
    menuTrigger: MenuTriggerAction
  ) => {
    if (menuTrigger === "manual" && isOpen) {
      setCountryFieldState((prevState) => ({
        inputValue: prevState.inputValue,
        selectedKey: prevState.selectedKey,
        items: countries,
      }));
    }
  };

  const onMonthSelectionChange = (key: Key | null) => {
    setMonthFieldState((prevState) => {
      const selectedItem = prevState.items.find((option) => option.key === key);

      return {
        inputValue: selectedItem?.label || "",
        selectedKey: key,
        items: months.filter((item) =>
          startsWith(item.label, selectedItem?.label || "")
        ),
      };
    });
  };

  const onMonthInputChange = (value: string) => {
    setMonthFieldState((prevState) => ({
      inputValue: value,
      selectedKey: value === "" ? null : prevState.selectedKey,
      items: months.filter((item) => startsWith(item.label, value)),
    }));
  };

  const onMonthOpenChange = (
    isOpen: boolean,
    menuTrigger: MenuTriggerAction
  ) => {
    if (menuTrigger === "manual" && isOpen) {
      setMonthFieldState((prevState) => ({
        inputValue: prevState.inputValue,
        selectedKey: prevState.selectedKey,
        items: months,
      }));
    }
  };

  return (
    <div
      className="flex flex-col md:flex-row md:items-center gap-3 max-w-[325px] md:max-w-[550px] md:py-3 md:px-[14px] mx-auto
     md:bg-black rounded-full"
    >
      <div className="flex gap-x-3 w-full py-3 px-[13.5px] md:p-0 bg-black md:bg-transparent rounded-full text-14reg md:w-[calc(66.7%-6px)]">
        <Autocomplete
          inputValue={countryFieldState.inputValue}
          items={countryFieldState.items}
          selectedKey={countryFieldState.selectedKey}
          onOpenChange={onCountryOpenChange}
          onInputChange={onCountryInputChange}
          onSelectionChange={onCountrySelectionChange}
          className="max-w-xs"
          label="Країна"
          radius="full"
          size="sm"
          selectorIcon={<SearchIcon />}
          disableSelectorIconRotation
          classNames={{ selectorButton: "mt-1 mr-1" }}
        >
          {(item) => (
            <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
          )}
        </Autocomplete>
        <Autocomplete
          inputValue={monthFieldState.inputValue}
          items={monthFieldState.items}
          selectedKey={monthFieldState.selectedKey}
          onOpenChange={onMonthOpenChange}
          onInputChange={onMonthInputChange}
          onSelectionChange={onMonthSelectionChange}
          className="max-w-xs"
          label="Місяць"
          radius="full"
          size="sm"
          selectorIcon={<SelectIcon />}
          classNames={{ selectorButton: "mt-1 mr-1" }}
        >
          {(item) => (
            <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
          )}
        </Autocomplete>
      </div>
      <Link href="/search" className="block w-full md:w-[calc(33.3%-6px)]">
        <MainButton variant="ghost white" className="w-full h-12 text-14med">
          Пошук
        </MainButton>
      </Link>
    </div>
  );
}
