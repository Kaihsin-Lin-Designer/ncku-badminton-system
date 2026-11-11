'server-only'
import { getPayload } from "payload"
import config from "@payload-config"
import type { User } from "@/payload-types";
import type { Where } from "payload";




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