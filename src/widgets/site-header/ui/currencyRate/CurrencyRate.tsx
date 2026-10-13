"use client";

import { Dropdown, Label } from "@heroui/react";
import Image from "next/image";
import { useCurrency } from "@/context/CurrencyContext";

export default function CurrencyToggle() {
  const { selected, setSelected, rate } = useCurrency();
  const currencySecond = selected === "EUR" ? "UAH" : "EUR";

  if (!rate) return <span className="text-[#E43A3A] text-sm font-medium">EUR</span>;

  const formatRate = selected === "EUR" ? rate.toFixed(2) : (1 / rate).toFixed(4);

  return (
    <Dropdown>
      <Dropdown.Trigger className="bg-transparent text-[#E43A3A] flex items-center gap-1 px-0 text-sm font-medium focus-visible:outline-2 focus-visible:outline-main">
        {selected}/{currencySecond} {formatRate}
        <Image
          className="ml-[8px]"
          alt="arrow down"
          src="/images/icons/arrow-down.svg"
          width={8}
          height={5}
        />
        {/*<ChevronDownIcon className="w-4 h-4 opacity-60" />*/}
      </Dropdown.Trigger>

      <Dropdown.Popover placement="bottom end">
        <Dropdown.Menu
          aria-label="Currency switch"
          selectedKeys={[selected]}
          selectionMode="single"
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0];
            if (value === "EUR" || value === "UAH") setSelected(value);
          }}
        >
          <Dropdown.Item id="EUR" textValue="EUR / UAH">
            <Dropdown.ItemIndicator />
            <Label>
              <div className="flex justify-between w-full gap-4">
                <span>EUR / UAH</span>
                <span className="opacity-60">{rate.toFixed(2)}</span>
              </div>
            </Label>
          </Dropdown.Item>

          <Dropdown.Item id="UAH" textValue="UAH / EUR">
            <Dropdown.ItemIndicator />
            <Label>
              <div className="flex justify-between w-full gap-4">
                <span>UAH / EUR</span>
                <span className="opacity-60">{(1 / rate).toFixed(4)}</span>
              </div>
            </Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
