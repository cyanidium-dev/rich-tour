import {TravelerInfo} from "@/components/shared/forms/BookingForm";
import { yesNo } from './utils/helpers'

export function mapTravelerToCrmPayload(traveler: TravelerInfo) {
    const hasPassport = Boolean(traveler.passport)

    const payload: any = {
        typesex: 'man',
        name: traveler.name,
        namelast: traveler.surname,

        findbyArray: ['externalid'],

        bdate: toCrmDate(traveler.birthDate),

        customfields: {
            Telefon: traveler.phone,
            Mistseposadki: traveler.boardingCity,
            Strahivka: yesNo(traveler.insurance),
            Platnimistsya: yesNo(traveler.frontSeats),
            Datanaroya: toCrmDate(traveler.birthDate),
        },
    }

    // Паспорт есть
    if (hasPassport) {
        payload.externalid = traveler.passport
        payload.customfields.Pasport = traveler.passport

        if (traveler.passportExpiration) {
            payload.customfields.Datazavershpasp =
                toCrmDate(traveler.passportExpiration);
        }
    } else {
        // Паспорт изготавливается
        payload.customfields.Pasportvigotovlyatsya = 'Так'
    }

    return payload
}

function toCrmDate(date: string) {
    // ожидаем DD.MM.YYYY
    const [day, month, year] = date.split('.')

    if (!day || !month || !year) {
        throw new Error(`Invalid date format: ${date}`)
    }

    return `${year}-${month}-${day}`
}
