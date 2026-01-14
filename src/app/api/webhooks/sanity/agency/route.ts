import { NextRequest, NextResponse } from 'next/server'
import { getCrmToken } from '@/lib/crm/getCrmToken'
import { sendAgencyToCrm } from '@/lib/crm/sendAgencyToCrm'
import {sendAgentToCrm} from "@/lib/crm/sendAgentToCrm";
import {updateAgencyCrmId} from "@/lib/crm/updateAgencyCrmId";
import {updateAgentCrmId} from "@/lib/crm/updateAgentCrmId";

export async function POST(req: NextRequest) {
    const secret = req.headers.get('x-sanity-secret')
    if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
        return NextResponse.json({ ok: true })
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
            { status: 200 }
        )
    }

    return NextResponse.json({ ok: true })
}

async function handleAgent(agent: any) {
    console.log('start add/update agent', agent._id)

    const token = await getCrmToken()

    const crmId = await sendAgentToCrm({
        token,

        externalId: agent._id,
        fullName: agent.companyName,

        // агент МОЖЕТ быть без агенции
        agencyCrmId: agent.agencyCrmId
            ? Number(agent.agencyCrmId)
            : undefined,

        phone: agent.phone,
        email: agent.email,

        website: agent.site,
        license: agent.edrpou,
        city: agent.city,
        taxForm: agent.taxForm,
        legalCompanyName: agent.legalCompanyName,
    })

    // 🔒 записываем crmId только один раз
    if (!agent.crmId) {
        await updateAgentCrmId(agent._id, crmId)
    }

    console.log('✅ Agent synced with CRM', {
        sanityId: agent._id,
        crmId,
        agencyCrmId: agent.agencyCrmId ?? null,
    })
}

async function handleAgency(agency: any) {
    console.log('start add/update agency', agency._id)

    const crmId = await sendAgencyToCrm({
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
    if (!agency.crmId) {
        await updateAgencyCrmId(agency._id, crmId)
    }

    console.log('✅ Agency synced with CRM', {
        sanityId: agency._id,
        crmId,
    })
}
