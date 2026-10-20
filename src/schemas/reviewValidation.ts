import { z } from "zod";
import { callBackValidation } from "./callBackFormValidation";

export const reviewValidation = callBackValidation().extend({
  message: z
    .string()
    .trim()
    .min(1, "Напишіть текст відгуку")
    .max(200, "Відгук не повинен містити більше 200 символів"),
});
