import { FormikHelpers } from "formik";
import { Dispatch, SetStateAction } from "react";

export const handleSubmitForm = async <T,>(
  { resetForm }: FormikHelpers<T>,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setIsError: Dispatch<SetStateAction<boolean>>,
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>,
  setIsPopUpShown?: Dispatch<SetStateAction<boolean>>
) => {
  try {
    setIsLoading(true);
    resetForm();
    if (setIsPopUpShown) {
      setIsPopUpShown(false);
    }
  } catch (error) {
    setIsError(true);
    return error;
  } finally {
    setIsLoading(false);
    setIsNotificationShown(true);
  }
};
