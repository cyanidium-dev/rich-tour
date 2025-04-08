"use client";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { countries, months } from "./mockedData";
import MainButton from "@/components/shared/buttons/MainButton";
import Link from "next/link";
import SearchIcon from "@/components/shared/icons/SearchIcon";
import SelectIcon from "@/components/shared/icons/SelectIcon";

export default function Search() {
  return (
    <div
      className="flex flex-col md:flex-row md:items-center gap-3 max-w-[325px] md:max-w-[550px] md:py-3 md:px-[14px] mx-auto
     md:bg-black rounded-full"
    >
      <div className="flex gap-x-3 w-full py-3 px-[13.5px] md:p-0 bg-black md:bg-transparent rounded-full text-14reg md:w-[calc(66.7%-6px)]">
        <Autocomplete
          className="max-w-xs"
          label="Країна"
          radius="full"
          size="sm"
          selectorIcon={<SearchIcon />}
          disableSelectorIconRotation
          classNames={{ selectorButton: "mt-1 mr-1" }}
        >
          {countries.map((animal) => (
            <AutocompleteItem key={animal.key}>{animal.label}</AutocompleteItem>
          ))}
        </Autocomplete>
        <Autocomplete
          className="max-w-xs"
          label="Місяць"
          radius="full"
          size="sm"
          selectorIcon={<SelectIcon />}
          classNames={{ selectorButton: "mt-1 mr-1" }}
        >
          {months.map((animal) => (
            <AutocompleteItem key={animal.key}>{animal.label}</AutocompleteItem>
          ))}
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
