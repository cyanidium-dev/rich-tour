import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

import { sendTravelersToCrm } from '@/lib/crm/sendTravelersToCrm'
import { sendOrderToCrm } from '@/lib/crm/sendOrderToCrm'

export async function POST(req: Request) {
    try {
        const body = await req.json()

        // ─────────────────────────────────────────────
        // 1️⃣ Пытаемся получить crmId агента из JWT
        // ─────────────────────────────────────────────
        let crmUserId: number | null = null

        const cookieStore = await cookies()
        const token = cookieStore.get('auth_token')?.value

        if (token) {
            try {
                const { payload } = await jwtVerify(
                    token,
                    new TextEncoder().encode(process.env.JWT_SECRET!)
                )

                if (typeof payload.crmId === 'number') {
                    crmUserId = payload.crmId
                }
            } catch {
                // если токен невалиден — считаем пользователя гостем
                crmUserId = null
            }
        }

        // ─────────────────────────────────────────────
        // 2️⃣ Создаём / находим туристов в CRM
        // ─────────────────────────────────────────────
        const crmTravelerIds = await sendTravelersToCrm(body.travelers)

        // ─────────────────────────────────────────────
        // 3️⃣ Создаём заявку в CRM
        // ─────────────────────────────────────────────
        const crmOrderId = await sendOrderToCrm({
            tourId: body.tourId,
            crmTravelerIds,
            date: body.date, // DD.MM.YYYY → будет сконвертировано в маппере
            travelersQty: body.travelersQty,
            message: body.message,
            crmUserId, // 👈 если null — client.userid НЕ добавится
        })

        // ─────────────────────────────────────────────
        // 4️⃣ Ответ фронтенду
        // ─────────────────────────────────────────────
        return NextResponse.json({
            status: 'ok',
            crmOrderId,
        })
    } catch (error) {
        console.error('BOOKING ERROR:', error)

        return NextResponse.json(
            { error: 'Failed to create booking' },
            { status: 500 }
        )
    }
}
