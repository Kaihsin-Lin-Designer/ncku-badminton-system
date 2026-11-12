import 'server-only'
import { payloadSendVerifyMail, payloadGetUserByEmail } from '@/lib/auth/payload-server-only';
import { getPreLoginData } from '@/lib/auth/pre-login';
import { NextResponse } from 'next/server';

export async function POST() {
    const preLoginData = await getPreLoginData();
    if (!preLoginData) return NextResponse.json({
        ok: false
    }, {
        status: 401
    })

    const user = await payloadGetUserByEmail(preLoginData.email);
    if (!user) return NextResponse.json({
        ok: false
    }, {
        status: 401
    })

    const result = await payloadSendVerifyMail(user);
    if (!result.ok) return NextResponse.json({
        ok: false
    }, {
        status: 401
    })


    return NextResponse.json({
        ok: true
    }, {
        status: 200
    })
}