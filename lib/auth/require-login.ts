// lib/auth/payload-server-only.ts
import 'server-only'
import { redirect } from 'next/navigation'
import type { User } from '@/payload-types'
import { payloadGetCurrentUser } from './payload-server-only'
import { getPayload } from 'payload'
import config from "@payload-config"
import isEmail from 'validator/lib/isEmail'
import { getPreLoginData, PreLoginData } from './pre-login'

export async function requireUserLogin(): Promise<User> {
    const user = await payloadGetCurrentUser()
    if (!user) redirect('/login?reason=login-required')
    return user
}

export async function requireUserPreLogin(): Promise<PreLoginData> {
    const preLoginData = await getPreLoginData();
    if (!preLoginData) redirect('/login?reason=login-required');

    return preLoginData
}

// export async function requireUserPreLogin(email: User["email"]): Promise<User> {
//     const payload = await getPayload({config});

//     email = email.trim().toLowerCase();
//     if (!isEmail(email)) redirect('/login?reason=login-required')

//     try {
//         const users = await payload.find({
//             collection: "users",
//             where: {
//                 email: {equals: email}
//             }
//         })

//         const user = users.docs[0];

//         if (!user || typeof user !== "object") redirect('/login?reason=login-required');

//         return user
//     }
//     catch (error) {
//         console.error(error);
//         redirect('/login?reason=login-required');
//     }
// }