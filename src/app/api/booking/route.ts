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
        let crmUserId: number | string | null = null

        const cookieStore = await cookies()
        const token = cookieStore.get('auth_token')?.value;
        // console.log("token", token);

        if (token) {
            try {
                const { payload } = await jwtVerify(
                    token,
                    new TextEncoder().encode(process.env.JWT_SECRET!)
                )

                if (payload.crmId) {
                    //@ts-expect-error
                    crmUserId = payload.crmId
                }
            } catch {
                // если токен невалиден — считаем пользователя гостем
                crmUserId = null
            }
        }

        // console.log("crmUserId", crmUserId);
        // ─────────────────────────────────────────────
        // 2️⃣ Создаём / находим туристов в CRM
        // ─────────────────────────────────────────────
        const crmTravelerIds = await sendTravelersToCrm(body.travelers)
// return;
        // ─────────────────────────────────────────────
        // 3️⃣ Создаём заявку в CRM
        // ─────────────────────────────────────────────

        const crmOrderId = await sendOrderToCrm({
            tourId: body.tourId,
            crmTravelerIds,
            date: body.date,
            travelersQty: body.travelersQty,
            message: body.message,
            name: body.companyName || `${body.travelers[0].name} ${body.travelers[0].surname}`,
            email: body.email,
            phone: body.phone,
            //@ts-expect-error
            crmUserId, //
        })

        // ─────────────────────────────────────────────
        // 4️⃣ Ответ фронтенду
        // ─────────────────────────────────────────────
        return NextResponse.json({
            status: 'ok',
            crmOrderId,
        })
    } catch (error) {
        console.error('BOOKING ERROR:', error);
        let message = "Щось пішло не так";
        //@ts-expect-error
        if(error?.message) {
            //@ts-expect-error
            message = error.message;
        }
        //@ts-expect-error
        if(error.response?.data?.errorArray) {
            //@ts-expect-error
            message = error.response?.data?.errorArray[0];
        }
        return NextResponse.json(
            // @ts-expect-error
            { error: message },
            { status: 500 }
        )
    }
}
