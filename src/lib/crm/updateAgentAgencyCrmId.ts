import client from '@/lib/sanity/client'

export async function updateAgentAgencyCrmId(
    agentId: string,
    agencyCrmId: string
) {
    await client
        .patch(agentId)
        .set({ agencyCrmId })
        .commit()
}
