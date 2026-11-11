'use server'
import { cookies } from 'next/headers'
import { getPayload } from "payload"
import config from "@payload-config"
import type { User } from "@/payload-types";
import isEmail from "validator/lib/isEmail";

export type LoginResult = {
    ok: true,
    id: User["id"]
} | {
    ok: false,
    reason: "Invalid email" |"Invalid password" | "Login fail"
}

/**
 * use payload api for normal login
 * @param email login email
 * @param password login password
 * @returns LoginResult
 */
export async function payloadLogin(email: User["email"], password: User["password"]): Promise<LoginResult> {
    
    if(typeof email !== "string") return {
        ok: false,
        reason: "Invalid email"
    }

    const emailFormat = isEmail(email);

    if(!emailFormat) return {
        ok: false,
        reason: "Invalid email"
    }


    if(typeof password !== "string") return {
        ok: false,
        reason: "Invalid password"
    }

    const payload = await getPayload({config});


    try {

        const res = await payload.login({
            collection: "users",
            data: {
                email: email,
                password: password
            }
        })

        if (!res.user || typeof res.user !== 'object') return {
            ok: false,
            reason: "Login fail"
        };



        (await cookies()).set(`${payload.config.cookiePrefix}-token`, String(res.token), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            expires: res.exp ? new Date(res.exp * 1000) : undefined,
        })

        return {
            ok: true,
            id: res.user.id
        }
    }
    catch (error) {
        console.error(error);
        return {
            ok: false,
            reason: "Login fail"
        }
    }




}