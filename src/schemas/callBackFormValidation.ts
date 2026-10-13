import { z } from "zod";
import { nameRegex, phoneRegex } from "@/regex/regex";

export const callBackValidation = () =>
  z.object({
    name: z
      .string()
      .min(1, "Дане поле обов'язкове до заповнення")
      .min(2, "Ім’я повинно містити від 2 до 30 символів")
      .max(30, "Ім’я повинно містити від 2 до 30 символів")
      .regex(nameRegex, "Допустимі літери та дефіс, апостроф, лапки"),
    phone: z
      .string()
      .min(1, "Дане поле обов'язкове до заповнення")
      .regex(phoneRegex, "Вкажіть правильний номер телефону")
      .refine((value) => value.length >= 6 && value[5] === "0", "Після +38 має бути цифра 0"),
    message: z.string().max(200, "Повинно містити не більше 200 символів"),
  });

export type ValuesCallBackFormType = z.infer<ReturnType<typeof callBackValidation>>;
