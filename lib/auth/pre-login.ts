import 'server-only'
import { cookies } from 'next/headers';
import { sealData, unsealData} from 'iron-session'
import { redirect } from "next/navigation";
import { User } from '@/payload-types';
import { connection } from 'next/server'

const COOKIE = 'pre-login'
const PASSWORD = process.env.APP_COOKIE_SECRET!
const TTL = 60 * 30

export type PreLoginData = {
    email: User["email"]
}

export async function setPreLoginData(data: PreLoginData): Promise<void> {
    await connection();
    const sealed = await sealData(data, {password: PASSWORD, ttl: TTL});

    const cookieStore = await cookies();

    cookieStore.set(COOKIE, sealed, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: TTL,
    })
}

export async function getPreLoginData(): Promise<PreLoginData | null> {
    await connection();
    const cookieStore = await cookies();
    const sealed = cookieStore.get(COOKIE)?.value; 
    if (!sealed || typeof sealed !== "string") return null;
    const unsealed = await unsealData<PreLoginData>(sealed, {password: PASSWORD, ttl: TTL})
    return unsealed;
}