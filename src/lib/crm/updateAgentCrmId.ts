import client from "../sanity";

export async function updateAgentCrmId(
    sanityId: string,
    crmId: string
) {
    await client
        .patch(sanityId)
        .setIfMissing({ crmId })
        .commit()
}
