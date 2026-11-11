'use server'

import { User } from "@/payload-types";
import type { Payload } from "payload";
import isEmail from 'validator/lib/isEmail';
import { getPayload } from 'payload'
import config from '@payload-config'
import crypto from "crypto"

export type SignUpResult = {
    ok: true,
    id: number
} | {
    ok: false,
    reason: "Invalid email format" | "User email duplicated" | "New user create fail"
}


/**
 * @brief sign up for a user through payload method
 * @param email 
 * @returns SignUpResult
 */
export async function payloadSignUp(email: User["email"]): Promise<SignUpResult> {
    const payload = await getPayload({config});

    // check email format
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

    if (duplicatedUsers.docs.length >= 1) {
        return {
            ok: false,
            reason: "User email duplicated"
        }
    }

    const newUser = await payload.create({
        collection: "users",
        data: {
            email: email,
            password: "rootncku",
            review_status: "not_started"
        },
    })

    if (!newUser || typeof newUser !== "object") {
        return {
            ok: false,
            reason: "New user create fail"
        }
    }


    return {
        ok: true,
        id: newUser.id
    };
}