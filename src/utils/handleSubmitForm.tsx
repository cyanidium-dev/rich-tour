// utils/handleSubmitForm.ts
import { FormikHelpers } from "formik";
import { Dispatch, SetStateAction } from "react";
export const handleSubmitForm = async <TValues,>(
    _values: TValues,
    { resetForm }: FormikHelpers<TValues>,
    setIsLoading: Dispatch<SetStateAction<boolean>>,
    setIsError: Dispatch<SetStateAction<boolean>>,
    setIsNotificationShown: Dispatch<SetStateAction<boolean>>,
    setIsPopUpShown?: Dispatch<SetStateAction<boolean>>
) => {
  try {
    setIsLoading(true);
    setIsError(false);

    resetForm();

    if (setIsPopUpShown) {
      setIsPopUpShown(false);
    }

    setIsNotificationShown(true);
  } catch {
    setIsError(true);
    setIsNotificationShown(true);
  } finally {
    setIsLoading(false);
  }
};
