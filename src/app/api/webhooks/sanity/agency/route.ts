import { NextRequest, NextResponse } from 'next/server'
import { getCrmToken } from '@/lib/crm/getCrmToken'
import { sendAgencyToCrm } from '@/lib/crm/sendAgencyToCrm'
import {sendAgentToCrm} from "@/lib/crm/sendAgentToCrm";

export async function POST(req: NextRequest) {
    const secret = req.headers.get('x-sanity-secret')
    if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let payload: any

    try {
        payload = await req.json()
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const { _id, _type } = payload

    if (!_id || !_type) {
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    try {
        switch (_type) {
            case 'agentUser':
                await handleAgent(payload)
                break

            case 'agencyUser':
                if (
                    Object.keys(payload).length <= 2 &&
                    payload._id &&
                    payload._type
                ) {
                    return NextResponse.json({ ok: true })
                }

                await handleAgency(payload)
                break
        }
    } catch (error: any) {
        console.error('❌ Webhook error:', {
            message: error?.message,
            stack: error?.stack,
            response: error?.response?.data,
            status: error?.response?.status,
        })

        return NextResponse.json(
            {
                error: 'Webhook processing failed',
                details: error?.response?.data ?? error?.message ?? 'Unknown error',
            },
            { status: 500 }
        )
    }

    return NextResponse.json({ ok: true })
}

async function handleAgent(agent: any) {
    const token = await getCrmToken()

    await sendAgentToCrm({
        token,

        externalId: agent._id,

        fullName: `${agent.firstName} ${agent.lastName}`,
        agencyCrmId: agent.agencyCrmId,

        phone: agent.phone,
        email: agent.email,

        website: agent.website,
        license: agent.license,
        city: agent.city,
        taxForm: agent.taxForm,
        legalCompanyName: agent.legalCompanyName,
    })
}

async function handleAgency(agency: any) {
    const token = await getCrmToken()
    console.log("start add");
    await sendAgencyToCrm({
        token,
        externalId: agency._id,
        legalAgencyName: agency.legalAgencyName,
        marketingAgencyName: agency.marketingAgencyName,
        phone: agency.agencyPhone,
        email: agency.agencyEmail,
        login: agency.login,
        edrpou: agency.agencyEdrpou,
        city: agency.agencyCity,
        legalAddress: agency.agencyLegalAddress,
        mainOfficeEmail: agency.mainOfficeEmail,
    })
}
