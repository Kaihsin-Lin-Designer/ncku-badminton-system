'use server'

import { User } from "@/payload-types";
import isEmail from 'validator/lib/isEmail';
import { getPayload } from 'payload'
import config from '@payload-config'
import crypto from "crypto"
import { payloadSendVerifyMail, SendVerifyMailResult } from "./payload-server-only";

export type SignUpResult = {
    ok: true
} | {
    ok: false,
    reason: "Invalid email format" | "Sign up failed" | Extract<SendVerifyMailResult, {ok: false}>["reason"]
}

const payload = await getPayload({config});


/**
 * @brief sign up for a user through payload method
 * @param email 
 * @returns SignUpResult
 */
export async function payloadSignUp(email: User["email"]): Promise<SignUpResult> {
    // const payload = await getPayload({config});

    // check email format
    email = email.trim().toLowerCase();
    if (!isEmail(email)) {
        return {
            ok: false,
            reason: "Invalid email format"
        }
    }
    
    // check if the email has already existed
    const duplicatedUsers = await payload.find({
        collection: "users",
        where: {
            email: {equals: email}
        }
    })

    let user: User;
    // email exists but is not verified
    if (duplicatedUsers.docs.length >= 1 && !duplicatedUsers.docs[0]._verified) {
        user = duplicatedUsers.docs[0];
    }
    // email exists and is verified
    else if (duplicatedUsers.docs.length >= 1 && duplicatedUsers.docs[0]._verified) {
        return {
            ok: false,
            reason: "Sign up failed"
        }
    }
    // email does not exist
    else {
        user = await payload.create({
            collection: "users",
            data: {
                email: email,
                password: crypto.randomBytes(64).toString('hex'),
                review_status: "not_started"
            },
        })

    }


    if (!user || typeof user !== "object") {
        return {
            ok: false,
            reason: "Sign up failed"
        }
    }

    const sendVerifyMailResult = await payloadSendVerifyMail(user);

    if (!sendVerifyMailResult.ok) return {
        ok: false,
        reason: sendVerifyMailResult.reason
    }


    return {
        ok: true,
    };
}

