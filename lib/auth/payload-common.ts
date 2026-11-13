'server-only'
import { createLocalReq, getPayload } from "payload"
import config from "@payload-config"
import type { User } from "@/payload-types";
import type { Payload, PayloadRequest, Where } from "payload";
import { headers as getHeaders } from "next/headers";




export type GetUserResult = {
    ok: true,
    user: User
} | {
    ok: false,
    reason: "Unauthorized" | "Insufficient Input"
}

/**
 * 
 * @param search_params use email or id to search for a user 
 * @returns GetUserResult
 */
export async function payloadGetUser({
    email,
    id
}: {
    email?: User["email"],
    id?: User["id"]
}): Promise<GetUserResult> {
    const payload = await getPayload({config});

    let whereQuery: Where = {};

    if (!email && !id) return {
        ok: false,
        reason: "Insufficient Input"
    }

    if (email && typeof email === "string") whereQuery = {...whereQuery, email: {equals: email}}
    if (id && typeof id === "string") whereQuery = {...whereQuery, id: {equals: id}}
    if (Object.keys(whereQuery).length === 0) return {
        ok: false,
        reason: "Insufficient Input"
    }

    try {
        const users = await payload.find({
            collection: "users",
            where: whereQuery
        })

        const user = users.docs[0]

        if (!user || typeof user !== "object") return {
            ok: false,
            reason: "Unauthorized"
        }

        return {
            ok: true,
            user: user
        }
    }
    catch (error) {
        console.error(error);
        return {
            ok: false,
            reason: "Unauthorized"
        }
    }

}

export async function payloadGetUserFromHeaders(payload: Payload): Promise<User | null> {
    const headers = await getHeaders();

    const {user} = await payload.auth({headers});
    if (user?.collection !== "users") return null;
    return user;
}

export async function payloadGetLocalReq(payload: Payload): Promise<PayloadRequest | null> {
    const user = await payloadGetUserFromHeaders(payload);

    if (!user) return null;

    const req = await createLocalReq({user: user}, payload);
    return req;
}