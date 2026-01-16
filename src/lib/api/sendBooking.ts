import axios from 'axios'
import { ValuesBookingFormType } from '@/components/shared/forms/BookingForm'

export async function sendBooking(
    payload: ValuesBookingFormType & { tourId: string }
) {
    const { data } = await axios.post('/api/booking', payload, {
        headers: {
            'Content-Type': 'application/json',
        },
    })

    return data
}
