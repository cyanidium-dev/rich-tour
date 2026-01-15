import client from '@/lib/sanity'

export async function updateAgentAgencyCrmId(
    agentId: string,
    agencyCrmId: string
) {
    await client
        .patch(agentId)
        .set({ agencyCrmId })
        .commit()
}
