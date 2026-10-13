"use client";
import { useState } from "react";
import {
  useFormContext,
  useWatch,
  type FieldArrayWithId,
  type UseFieldArrayRemove,
} from "react-hook-form";
import { BookingCheckbox } from "./BookingFields";
import CustomizedInput from "./BookingInput";
import IconButton from "@/components/shared/buttons/IconButton";
import TrashIcon from "@/components/shared/icons/TrashIcon";
import { type BookingValues } from "../model/schemas";
export default function PassengerSection({
  agent = false,
  fields,
  remove,
}: {
  agent?: boolean;
  fields: FieldArrayWithId<BookingValues, "travelers">[];
  remove: UseFieldArrayRemove;
}) {
  const { control, setValue } = useFormContext<BookingValues>();
  const values = useWatch({ control }) as BookingValues;
  const [focusedTravelerIndex, setFocusedTravelerIndex] = useState<number | null>(null);
  const setFieldValue = (name: string, value: unknown) =>
    setValue(
      name.replace(/\[(\d+)\]/g, ".$1") as import("react-hook-form").FieldPath<BookingValues>,
      value as never,
      { shouldDirty: true, shouldValidate: true },
    );
  return (
    <>
      {" "}
      <div className="flex flex-col gap-y-4">
        {fields.map((traveler, index) => (
          <div
            key={traveler.id}
            className={`flex gap-x-[6px] lg:gap-x-3 ${
              index === focusedTravelerIndex
                ? "lg:p-5 lg:border lg:border-black lg:rounded-[6px]"
                : ""
            }`}
          >
            <div className="flex flex-col gap-y-4 w-[calc(100%-6px-24px)] lg:w-full">
              <div className="flex flex-col lg:flex-row gap-y-4 lg:gap-x-3">
                <div className="flex gap-x-3 ">
                  <p
                    className={`flex items-center justify-center w-10 lg:w-[43px] h-10 text-16med border border-black rounded-[6px] ${
                      index === focusedTravelerIndex ? "lg:hidden" : ""
                    }`}
                  >
                    {index + 1}
                  </p>
                  <CustomizedInput
                    fieldName={`travelers[${index}].surname`}
                    placeholder="Прізвище латиницею"
                    labelClassName="w-[calc(100%-40px-12px-2px)] lg:w-[296px]"
                    onFocus={() => setFocusedTravelerIndex(index)}
                    fieldFontSize="text-10reg lg:text-12reg"
                  />
                </div>
                <CustomizedInput
                  fieldName={`travelers[${index}].name`}
                  placeholder="Ім’я латиницею"
                  onFocus={() => setFocusedTravelerIndex(index)}
                  labelClassName={` ${
                    index === focusedTravelerIndex ? "lg:w-[276px]" : "lg:w-[269px]"
                  }`}
                  fieldFontSize="text-10reg lg:text-12reg"
                />
              </div>
              {focusedTravelerIndex === index && (
                <>
                  <div className="flex flex-col lg:flex-row gap-y-4 gap-x-3">
                    <CustomizedInput
                      fieldName={`travelers[${index}].phone`}
                      placeholder="Номер телефону"
                      mask="phone"
                      inputType="tel"
                      onFocus={() => setFocusedTravelerIndex(index)}
                      labelClassName="lg:w-[296px]"
                      fieldFontSize="text-10reg lg:text-12reg"
                    />
                    <CustomizedInput
                      fieldName={`travelers[${index}].passport`}
                      placeholder={agent ? "Номер закордонного паспорта" : "AA123456"}
                      mask={agent ? undefined : "passport"}
                      onFocus={() => setFocusedTravelerIndex(index)}
                      labelClassName="lg:w-[276px]"
                      fieldFontSize="text-10reg lg:text-12reg"
                      disabled={!agent && values.travelers[index].passportInProgress}
                      onChange={
                        agent
                          ? undefined
                          : (e) => {
                              const cleaned = e.target.value
                                .replace(/[^a-zA-Z0-9]/g, "")
                                .toUpperCase();
                              setFieldValue(`travelers[${index}].passport`, cleaned);
                            }
                      }
                    />
                  </div>
                  <div className="flex flex-col lg:flex-row gap-y-4 gap-x-3">
                    <CustomizedInput
                      fieldName={`travelers[${index}].birthDate`}
                      placeholder="Дата народження"
                      mask="date"
                      onFocus={() => setFocusedTravelerIndex(index)}
                      labelClassName="lg:w-[145px]"
                      fieldFontSize="text-10reg lg:text-12reg"
                    />
                    <CustomizedInput
                      fieldName={`travelers[${index}].passportExpiration`}
                      placeholder="Закінчення дії паспорта"
                      mask="date"
                      onFocus={() => setFocusedTravelerIndex(index)}
                      labelClassName="lg:w-[208px]"
                      fieldFontSize="text-10reg lg:text-12reg"
                      disabled={!agent && values.travelers[index].passportInProgress}
                    />
                    <CustomizedInput
                      fieldName={`travelers[${index}].boardingCity`}
                      placeholder="Місто посадки"
                      onFocus={() => setFocusedTravelerIndex(index)}
                      labelClassName="lg:w-[207px]"
                      fieldFontSize="text-10reg lg:text-12reg"
                    />
                  </div>
                  <div className="flex flex-col lg:flex-row gap-y-4 gap-x-6">
                    <BookingCheckbox
                      isSelected={values.travelers[index].insurance}
                      onChange={(value) => {
                        setFieldValue(`travelers[${index}].insurance`, value);
                      }}
                    >
                      Страховка
                    </BookingCheckbox>
                    <BookingCheckbox
                      isSelected={values.travelers[index].frontSeats}
                      onChange={(value) => {
                        setFieldValue(`travelers[${index}].frontSeats`, value);
                      }}
                    >
                      Передні місця
                    </BookingCheckbox>
                    <BookingCheckbox
                      emphasized
                      isSelected={values.travelers[index].passportInProgress}
                      onChange={(value) => {
                        setFieldValue(`travelers[${index}].passportInProgress`, value);
                        if (value && !agent) {
                          setFieldValue(`travelers[${index}].passport`, "");
                          setFieldValue(`travelers[${index}].passportExpiration`, "");
                        }
                      }}
                    >
                      Паспорт виготовляється
                    </BookingCheckbox>
                  </div>
                </>
              )}
            </div>
            {(agent || values.travelers.length > 1) && (
              <IconButton
                handleClick={() => {
                  if (
                    values.travelers.length <= 1 ||
                    (agent && typeof values.travelersQty !== "number")
                  )
                    return;
                  remove(index);
                  setFieldValue(
                    "travelersQty",
                    typeof values.travelersQty === "number" ? values.travelersQty - 1 : null,
                  );
                }}
                className="h-[38px]"
              >
                <TrashIcon className="size-6" />
              </IconButton>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
