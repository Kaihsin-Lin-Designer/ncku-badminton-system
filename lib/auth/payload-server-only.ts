'server-only'

import { User } from "@/payload-types";
import isEmail from 'validator/lib/isEmail';
import { getPayload } from 'payload'
import config from '@payload-config'
import crypto from "crypto"

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

    // check email
    const email = user.email.trim().toLowerCase();
    if (!isEmail(email)) return {
        ok: false,
        reason: "Invalid email"
    }

    const newToken = crypto.randomBytes(64).toString('hex');

    const transactionID = await payload.db.beginTransaction();

    if (typeof transactionID !== "string" && typeof transactionID !== "number") return {
        ok: false,
        reason: "Begin transaction failed"
    }

    

    try {
        // update new token
        await payload.update({
            collection: "users",
            id: user.id,
            data: {
                _verificationToken: newToken
            },
            req: {transactionID}
        })

        const verifyUrl = `${process.env.APP_FRONTEND_URL || "http://localhost:3000"}/set-password?token=${newToken}`;

        await payload.sendEmail({
            to: user.email,
            subject: "驗證您的信箱並設定密碼",
            html: `<a href=${verifyUrl}>點此驗證</a><div>${verifyUrl}</div>`
        })
        

        await payload.db.commitTransaction(transactionID);

        return {
            ok: true
        }
    }
    catch (error) {
        console.error("payloadSendVerifyMail: ", error);
        await payload.db.rollbackTransaction(transactionID);
        return {
            ok: false,
            reason: "Update token or send email failed"
        }
    }
}