import { getAuthUser } from "./getAuthUser";
import {getAgencyById} from "./repository";

export type AgencyProfile = {
    _id: string;
    legalAgencyName: string;
    marketingAgencyName?: string;
    login: string;
    agencyEdrpou?: string;
    agencyCity?: string;
    agencyLegalAddress?: string;
    agencyEmail: string;
    agencyPhone: string;
    mainOfficeEmail: string;
};

export async function getAuthAgencyProfile(): Promise<AgencyProfile | null> {
    const auth = await getAuthUser();

    if (!auth || auth.role !== "agency") {
        return null;
    }

    const agency = await getAgencyById(auth.sub);
    if (!agency) return null;

    return {
        _id: agency._id,
        legalAgencyName: agency.legalAgencyName,
        marketingAgencyName: agency.marketingAgencyName ?? undefined,
        login: agency.login,
        agencyEdrpou: agency.agencyEdrpou ?? undefined,
        agencyCity: agency.agencyCity ?? undefined,
        agencyLegalAddress: agency.agencyLegalAddress ?? undefined,
        agencyEmail: agency.agencyEmail,
        agencyPhone: agency.agencyPhone,
        mainOfficeEmail: agency.mainOfficeEmail,
    };
}
