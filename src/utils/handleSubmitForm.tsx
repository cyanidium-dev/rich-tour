// utils/handleSubmitForm.ts
import { FormikHelpers } from 'formik'
import { Dispatch, SetStateAction } from 'react'
import axios from 'axios'
import { sendBooking } from '@/lib/api/sendBooking'
import { ValuesBookingFormType } from '@/components/shared/forms/BookingForm'

type BookingSubmitValues = ValuesBookingFormType & {
  tourId: string
}

export const handleSubmitForm = async (
    values: BookingSubmitValues,
    { resetForm }: FormikHelpers<ValuesBookingFormType>,
    setIsLoading: Dispatch<SetStateAction<boolean>>,
    setIsError: Dispatch<SetStateAction<boolean>>,
    setIsNotificationShown: Dispatch<SetStateAction<boolean>>,
    setIsPopUpShown?: Dispatch<SetStateAction<boolean>>
) => {
  try {
    setIsLoading(true)
    setIsError(false)

    await sendBooking(values)

    resetForm()

    if (setIsPopUpShown) {
      setIsPopUpShown(false)
    }
  } catch (error) {
    console.error(error)

    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data)
    }

    setIsError(true)
  } finally {
    setIsLoading(false)
    setIsNotificationShown(true)
  }
}
