// app/actions/google-oauth.ts
import "server-only";

import { google } from 'googleapis'
import type { Auth } from 'googleapis'
import crypto from 'crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { connection } from 'next/server'



const scopes = ['openid', 'email', 'profile']



export const createOAuthClient = () => {
    return new google.auth.OAuth2(
        process.env.GOOGLE_OAUTH_CLIENT_ID,
        process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        process.env.GOOGLE_OAUTH_REDIRECT_URI
    )
}

export const signInWithGoogle = async () => {
    // 每次授權都產生新的 state，並存進 cookie 供 callback 比對

    await connection();

    const state = crypto.randomBytes(32).toString('hex');

    (await cookies()).set('oauth_state', state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // Google 導回來是 top-level GET，lax 才帶得到
        path: '/',
        maxAge: 60,
    })


    const oauth2Client = createOAuthClient();

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        include_granted_scopes: true,
        state,
        response_type: "code"
    })

    redirect(url)
}




type handleCodeResult = {
    event: "success" | "error",
    data: string
}

export const checkState = async (state: string): Promise<Boolean> => {
    const cookieStore = await cookies();
    const cookieState = cookieStore.get('oauth_state')?.value;
    cookieStore.delete("oauth_state");
    cookieStore.delete("oauth_verifier");

    return state == cookieState;
}

export const getOAuthClientTokens = async (oauth2Client: InstanceType<typeof google.auth.OAuth2>, code: string) => {

    const {tokens} = await oauth2Client.getToken(code);

    return tokens;
}

export const getOAuthClientWithCredential = async (code: string) => {
    const oauth2Client = createOAuthClient();

    const tokens = await getOAuthClientTokens(oauth2Client, code);

    oauth2Client.setCredentials(tokens);

    return oauth2Client;
}


export const getGoogleUserInfo = async (tokens: Auth.Credentials) => {
    const oauth2Client = createOAuthClient();
    if (!tokens.id_token) {
        console.error("no id_token")
        return null;
    }

    const ticket = await oauth2Client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
    })

    return ticket.getPayload();
}


export const handleCode = async (params: { [key: string]: string | string[] | undefined }): Promise<handleCodeResult> => {
    await connection();
    
    const oauth2Client = createOAuthClient();

    let result: handleCodeResult = {
        event: "error",
        data: ""
    }

    try {

        if (params.error) {
            console.error(params.error);
            result.data = ""
        }
        else if (!params.code)
        {
            console.error(params.error);
            result.data = ""
        }
        else {
            let { tokens } = await oauth2Client.getToken(params.code as string);
            oauth2Client.setCredentials(tokens);
            result = {
                event: "success",
                data: String(tokens.id_token)
            }
        }
    }
    catch(error) {
        console.error(params.error);
    }




    return result;
}