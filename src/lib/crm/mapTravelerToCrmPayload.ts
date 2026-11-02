import { TravelerInfo } from "@/contracts/booking";
import { yesNo } from "./utils/helpers";
import { needsInsuranceCode } from "@/features/booking/model/insurance";

export const CRM_IDENTIFICATION_CODE_FIELD = "Identifikatsiiniikod";

type CrmTraveler = {
  typesex: string;
  name: string;
  namelast: string;
  externalid: string;
  findbyArray: string[];
  bdate: string;
  customfields: {
    Telefon: TravelerInfo["phone"];
    Mistseposadki: string;
    Strahivka: string;
    Platnimistsya: string;
    Datanaroya: string;
    Pasport?: string;
    DaTazavpasp?: string;
    Pasportvigotovlyatsya?: string;
    [CRM_IDENTIFICATION_CODE_FIELD]?: string;
  };
};

export function mapTravelerToCrmPayload(traveler: TravelerInfo, requestId: string, index: number) {
  const hasPassport = Boolean(traveler.passport);

  const payload: CrmTraveler = {
    typesex: "man",
    name: traveler.name,
    namelast: traveler.surname,

    externalid: traveler.passport || `${requestId}:traveler:${index}`,
    findbyArray: ["externalid"],

    bdate: toCrmDate(traveler.birthDate),

    customfields: {
      Telefon: traveler.phone,
      Mistseposadki: traveler.boardingCity,
      Strahivka: yesNo(traveler.insurance),
      Platnimistsya: yesNo(traveler.frontSeats),
      Datanaroya: toCrmDate(traveler.birthDate),
    },
  };

  if (needsInsuranceCode(traveler) && traveler.identificationCode) {
    payload.customfields[CRM_IDENTIFICATION_CODE_FIELD] = traveler.identificationCode;
  }

  // Паспорт есть
  if (hasPassport) {
    payload.customfields.Pasport = traveler.passport;

    if (traveler.passportExpiration) {
      payload.customfields.DaTazavpasp = toCrmDate(traveler.passportExpiration);
    }
  } else {
    // Паспорт изготавливается
    payload.customfields.Pasportvigotovlyatsya = "Так";
  }

  return payload;
}

function toCrmDate(date: string) {
  // ожидаем DD.MM.YYYY
  const [day, month, year] = date.split(".");

  if (!day || !month || !year) {
    throw new Error(`Invalid date format: ${date}`);
  }

  return `${year}-${month}-${day}`;
}
