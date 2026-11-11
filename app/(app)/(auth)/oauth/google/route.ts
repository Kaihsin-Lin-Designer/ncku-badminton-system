import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation";
import { checkState, createOAuthClient, getOAuthClientTokens, getGoogleUserInfo } from "@/lib/auth/google";
import { findOrCreateUser, customPayloadJwt } from "@/lib/auth/payload";
import { getPayload } from 'payload'
import config from '@payload-config'


export async function GET(req: NextRequest) {
    const payload = await getPayload({config});

    await cookies();
    const params = Object.fromEntries(req.nextUrl.searchParams);

    let checkStateResult: Boolean = false;

    if (typeof(params.state) === "string") checkStateResult = await checkState(params.state);

    if (!checkStateResult) redirect("/oauth/google/fail");

    const oauth2Client = createOAuthClient();
    const tokens = await getOAuthClientTokens(oauth2Client, params.code);
    const userInfo = await getGoogleUserInfo(tokens);

    if (!userInfo) return redirect("/oauth/google/fail");


    const user = await findOrCreateUser(payload, {
        provider: "google",
        provider_account_id: userInfo.sub,
        email: userInfo.email ? userInfo.email : "",
        emailVerified: userInfo.email_verified ? userInfo.email_verified : false,
    })

    const cookie = await customPayloadJwt(payload, {
        provider: "google",
        provider_account_id: userInfo.sub,
        email: userInfo.email ? userInfo.email : "",
        emailVerified: userInfo.email_verified ? userInfo.email_verified : false,
    })

    return new Response(null, {
        status: 302,
        headers: { 
            Location: `/oauth/google/success?email=${user.email}&user_id=${user.id}`, 
            "Set-Cookie": cookie },
    });


    // return redirect(`/oauth/google/success?email=${user.email}&user_id=${user.id}`, {
        
    // });
}

