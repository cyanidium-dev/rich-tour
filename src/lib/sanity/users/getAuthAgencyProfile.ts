import client from "@/lib/sanity/client";
import { getAuthUser } from "./getAuthUser";

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

    return await client.fetch(
        `*[_type == "agencyUser" && _id == $id][0]{
            _id,
            legalAgencyName,
            marketingAgencyName,
            login,
            agencyEdrpou,
            agencyCity,
            agencyLegalAddress,
            agencyEmail,
            agencyPhone,
            mainOfficeEmail
        }`,
        { id: auth.sub }
    );
}
