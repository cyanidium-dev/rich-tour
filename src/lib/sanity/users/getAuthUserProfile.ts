// lib/getAuthAgentProfile.ts
import client from "@/lib/sanity/client";
import { getAuthUser } from "./getAuthUser";

export type AgentProfile = {
    _id: string;
    email: string;
    companyName: string;
    legalCompanyName: string;
    phone: string;
    edrpou: string;
    city: string;
    site?: string;
    taxForm: "fop" | "tov" | "other";
};

export async function getAuthAgentProfile(): Promise<AgentProfile | null> {
    const auth = await getAuthUser();

    if (!auth || auth.role !== "agent") {
        return null;
    }

    return await client.fetch(
        `*[_type == "agentUser" && _id == $id][0]{
      _id,
      email,
      companyName,
      legalCompanyName,
      phone,
      edrpou,
      city,
      site,
      taxForm
    }`,
        { id: auth.sub }
    );
}
