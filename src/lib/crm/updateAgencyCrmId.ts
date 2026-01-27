import client from "../sanity/client";

export async function updateAgencyCrmId(
    sanityId: string,
    crmId: string
) {
    await client
        .patch(sanityId)
        .set({ crmId })
        .commit({ autoGenerateArrayKeys: true })
}
