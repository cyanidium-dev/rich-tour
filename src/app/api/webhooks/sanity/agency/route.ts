import { NextRequest, NextResponse } from 'next/server'
import client from "@/lib/sanity";

import { getCrmToken } from '@/lib/crm/getCrmToken'
import { sendAgencyToCrm } from '@/lib/crm/sendAgencyToCrm'
import { sendAgentToCrm } from '@/lib/crm/sendAgentToCrm'
import { updateAgencyCrmId } from '@/lib/crm/updateAgencyCrmId'
import { updateAgentCrmId } from '@/lib/crm/updateAgentCrmId'
import {updateAgentAgencyCrmId} from "@/lib/crm/updateAgentAgencyCrmId";

export async function POST(req: NextRequest) {
    const secret = req.headers.get('x-sanity-secret')
    if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
        return NextResponse.json({ ok: true })
    }

    let payload: any
    try {
        payload = await req.json()
    } catch {
        return NextResponse.json({ ok: true })
    }

    const { _id, _type } = payload
    if (!_id || !_type) {
        return NextResponse.json({ ok: true })
    }

    try {
        switch (_type) {
            case 'agentUser':
                await handleAgent(payload)
                break

            case 'agencyUser':
                // защита от пустого payload (delete / system events)
                if (Object.keys(payload).length <= 2) {
                    return NextResponse.json({ ok: true })
                }

                await handleAgency(payload)
                break
        }
    } catch (error: any) {
        console.error('❌ Unhandled webhook error', {
            sanityId: _id,
            type: _type,
            message: error?.message,
        })

        // на всякий случай — жёстко удаляем документ
        try {
            await client.delete(_id)
        } catch {}
    }

    // 🔑 ВСЕГДА 200
    return NextResponse.json({ ok: true })
}

/* ─────────────────────────────
 * 🧑 AGENT
 * ───────────────────────────── */

async function handleAgent(agent: any) {
    console.log('start add/update agent', agent._id)
// 🔒 1️⃣ Сохраняем agencyCrmId, если он изменился
    if (
        agent.agencyCrmId &&
        agent.agencyCrmId !== agent._storedAgencyCrmId // см. ниже
    ) {
        await updateAgentAgencyCrmId(
            agent._id,
            String(agent.agencyCrmId)
        )
    }
    try {
        const token = await getCrmToken()
        console.log("agency CRM id", agent.agencyCrmId)
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

        // записываем crmId ТОЛЬКО один раз
        if (!agent.crmId) {
            await updateAgentCrmId(agent._id, crmId)
        }

        console.log('✅ Agent synced with CRM', {
            sanityId: agent._id,
            crmId,
            agencyCrmId: agent.agencyCrmId ?? null,
        })
    } catch (error: any) {
        console.error('❌ CRM error → deleting agent from Sanity', {
            sanityId: agent._id,
            error: error?.message,
        })

        await client.delete(agent._id)
    }
}

/* ─────────────────────────────
 * 🏢 AGENCY
 * ───────────────────────────── */

async function handleAgency(agency: any) {
    console.log('start add/update agency', agency._id);

    try {
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
    } catch (error: any) {
        console.error('❌ CRM error → deleting agency from Sanity', {
            sanityId: agency._id,
            error: error?.message,
        })

        await client.delete(agency._id)
    }
}
