import client from "../client";

export async function updateAgentCrmId(
    sanityId: string,
    crmId: string
) {
    await client
        .patch(sanityId)
        .setIfMissing({ crmId })
        .commit()
}
