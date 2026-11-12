import 'server-only'

import { User } from "@/payload-types";
import isEmail from 'validator/lib/isEmail';
import { getPayload } from 'payload'
import config from '@payload-config'
import crypto from "crypto"
import { headers as getHeaders } from 'next/headers'
import { connection } from 'next/server';

export type SignUpResult = {
    ok: true,
    user: User
} | {
    ok: false,
    reason: "Invalid email format" | "User email duplicated" | "New user create fail"
}

const payload = await getPayload({config});


export type SendVerifyMailResult = {
    ok: true,
} | {
    ok: false,
    reason: "Update token or send email failed" | "Invalid email" | "Begin transaction failed"
};

export async function payloadSendVerifyMail(user: User): Promise<SendVerifyMailResult> {
    await connection();
    // check email
    const email = user.email.trim().toLowerCase();
    if (!isEmail(email)) return {
        ok: false,
        reason: "Invalid email"
    }
    const newToken = await payload.forgotPassword({
        collection: 'users',
        data: { email },
        disableEmail: true
    })

    // const newToken = crypto.randomBytes(64).toString('hex');


    // const transactionID = await payload.db.beginTransaction();

    // if (typeof transactionID !== "string" && typeof transactionID !== "number") return {
    //     ok: false,
    //     reason: "Begin transaction failed"
    // }

    const verifyUrl = `${process.env.APP_FRONTEND_URL!}/reset-password?token=${newToken}`;

    try {
        await payload.sendEmail({
            to: email,
            subject: "驗證您的信箱並設定密碼",
            html: `<a href=${verifyUrl}>點此驗證</a><div>${verifyUrl}</div>`
        })
        return {
            ok: true
        }
    }
    catch (error) {
        console.error("payloadSendVerifyMail: ", error);
        return {
            ok: false,
            reason: "Update token or send email failed"
        }
    }
    

    // try {
    //     // update new token
    //     await payload.update({
    //         collection: "users",
    //         id: user.id,
    //         data: {
    //             _verificationToken: newToken
    //         },
    //         req: {transactionID}
    //     })

    //     const verifyUrl = `${process.env.APP_FRONTEND_URL!}/set-password?token=${newToken}`;

        
        
    //     await payload.db.commitTransaction(transactionID);
        
    //     await payload.sendEmail({
    //         to: email,
    //         subject: "驗證您的信箱並設定密碼",
    //         html: `<a href=${verifyUrl}>點此驗證</a><div>${verifyUrl}</div>`
    //     })
    //     return {
    //         ok: true
    //     }
    // }
    // catch (error) {
    //     console.error("payloadSendVerifyMail: ", error);
    //     await payload.db.rollbackTransaction(transactionID);
    //     return {
    //         ok: false,
    //         reason: "Update token or send email failed"
    //     }
    // }
}



export async function payloadGetCurrentUser(): Promise<User | null> {
    const payload = await getPayload({config});
    const headers = await getHeaders();

    try {
        const {user} = await payload.auth({headers: headers});
        if (!user || user.collection !== "users") return null;
        
        return user;
    }
    catch (error) {
        console.error(error);
        return null;
    }

}

export async function payloadGetUserByEmail(email: User["email"]): Promise<User | null> {
    email = email.trim().toLowerCase();
    if (!isEmail(email)) return null;

    const payload = await getPayload({config});
    const headers = await getHeaders();

    const users = await payload.find({
        collection: "users",
        where: {
            email: {equals: email}
        }
    })

    const user = users.docs[0];
    if (!user) return null;
    return user
}


export type ResetPasswordVerifyResult = {
    ok: true
} | {
    ok: false,
    reason: "Weak password" | "Long password" | "Password reset failed" | "Missing field"
}

export async function payloadResetPasswordVerify(token: User["resetPasswordToken"], newPassword: User["password"]): Promise<ResetPasswordVerifyResult> {
    if (!token || !newPassword) return {
        ok: false,
        reason: "Missing field"
    }

    if (newPassword.length < 8) return {
        ok: false,
        reason: "Weak password"
    }
    else if (newPassword.length > 64) return {
        ok: false,
        reason: "Long password"
    }

    const payload = await getPayload({config});

    const transactionID = await payload.db.beginTransaction()
    if (!transactionID) return {
        ok: false,
        reason: "Password reset failed"
    }
    
    try {
        const result = await payload.resetPassword({
            collection: "users",
            data: {
                password: newPassword,
                token: token
            },
            overrideAccess: true,
            req: {transactionID}
        })

        const user = result.user as unknown as User

        await payload.update({
            collection: "users",
            id: user.id,
            data: {
                _verified: true,
                email_verified_at: new Date().toISOString()
            },
            req: {transactionID}
        })
        
        await payload.db.commitTransaction(transactionID);
        return {
            ok: true
        }
    }
    catch (error) {
        console.error(error);
        await payload.db.rollbackTransaction(transactionID);
        return {
            ok: false,
            reason: "Password reset failed"
        }
    }
}

type VerifyResetPasswordTokenResult = {
    ok: true
} | {
    ok: false,
    reason: "No token" | "No match" | "Expired"
}
export async function payloadVerifyResetPasswordToken(token: User["resetPasswordToken"]): Promise<VerifyResetPasswordTokenResult> {
    if (!token) return {
        ok: false,
        reason: "No token"
    }

    const payload = await getPayload({config});

    const users = await payload.find({
        collection: "users",
        where: {
            resetPasswordToken: {equals: token}
        },
        showHiddenFields: true,
        limit: 1
    })

    if (users.docs.length === 0) return {
        ok: false,
        reason: "No match"
    }

    if (!users.docs[0].resetPasswordExpiration) return {
        ok: false,
        reason: "No token"
    }

    const expiration = new Date(users.docs[0].resetPasswordExpiration);
    const now = new Date();
    if (now >= expiration) return {
        ok: false,
        reason: "Expired"
    }

    return {
        ok: true
    }
}