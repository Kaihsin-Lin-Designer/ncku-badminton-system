import 'server-only'
import { payloadSendVerifyMail, payloadGetUserByEmail } from '@/lib/auth/payload-server-only';
import { getPreLoginData } from '@/lib/auth/pre-login';
import { payloadResetPasswordVerify } from '@/lib/auth/payload-server-only';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const {token, new_password} = await request.json();
    if (!token || !new_password) return NextResponse.json({
        ok: false
    }, {
        status: 401
    })

    const result = await payloadResetPasswordVerify(token, new_password);
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