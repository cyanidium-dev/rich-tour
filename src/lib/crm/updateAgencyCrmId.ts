import client from "../sanity";

export async function updateAgencyCrmId(
    sanityId: string,
    crmId: string
) {
    await client
        .patch(sanityId)
        .set({ crmId })
        .commit({ autoGenerateArrayKeys: true })
}
