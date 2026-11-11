import type { CollectionConfig, Payload } from "payload";
import type { Account } from "@/payload-types";
import { APIError } from "payload";
import crypto from "crypto";
import { User } from "@/payload-types";
import { jwtSign, getFieldsToSign, generatePayloadCookie } from "payload";
import { NextResponse } from "next/server";

type Entry = Pick<Account, "provider" | "provider_account_id"> & {
    email: string,
    emailVerified: boolean
}

export async function findOrCreateUser(payload: Payload, entry: Entry): Promise<User> {

    
    const transactionID = await payload.db.beginTransaction()
    if (!transactionID) throw new Error("Transactions are not available");

    try {

        // 1.
        // if the account exists
        // login
        const linked = await payload.find({
            collection: "accounts",
            where: {
                and: [
                    {provider: {equals: entry.provider}},
                    {provider_account_id: {equals: entry.provider_account_id}}
                ],
            },
            limit: 1,
            depth: 1,
            req: {transactionID}
        })
    
        const linkedUser = linked.docs[0]?.user
    
        if (linkedUser && typeof linkedUser === 'object') {
            await payload.db.commitTransaction(transactionID)
            return linkedUser
        }


        if (!entry.emailVerified) {
            console.error("provider email not verified")
            throw new APIError("此登入方式的 email 未經驗證", 403);
        }
    
    
        // find user with same email
    
        
    
        const existEmail = await payload.find({
            collection: "users",
            where: {
                email: {equals: entry.email}
            },
            req: {transactionID}
        })
    
        
        let existEmailUser = existEmail.docs[0];
    
        // if email did not exist
        // create a new user with the email
        if (!existEmailUser || typeof existEmailUser !== "object") {
            existEmailUser = await payload.create({
                collection: "users",
                data: {
                    email: entry.email,
                    password: crypto.randomBytes(32).toString("hex"),
                    _verified: true,
                    review_status: "not_started"
                },
                disableVerificationEmail: true,
                req: {transactionID}
            })
        }

        // if someone registered first and didn't verify the email (might be hacker)
        // update that user password before linking
        if (!existEmailUser._verified) {

            existEmailUser = await payload.update({
                collection: "users",
                id: existEmailUser.id,
                data: {
                    password: crypto.randomBytes(32).toString("hex"),
                    _verified: true
                },
                req: {transactionID}
            })
        }

        // 3.
        // now there should be a user with the same email
        // link them

        await payload.create({
            collection: "accounts",
            data: {
                provider: entry.provider,
                provider_account_id: entry.provider_account_id,
                user: existEmailUser.id,
            },
            req: {transactionID}
        })
        

        await payload.db.commitTransaction(transactionID)
        return existEmailUser
        
    }
    catch (error) {
        await payload.db.rollbackTransaction(transactionID)
        console.error("findOrCreateUser failed:", error);
        throw error;
    }
}

export async function customPayloadJwt(payload: Payload, {
    email,
    emailVerified,
    provider,
    provider_account_id
}: Entry) {

    const collectionConfig = payload.collections.users.config;
    const {tokenExpiration, useSessions} = collectionConfig.auth;
 
    

    const accounts = await payload.find({
        collection: "accounts",
        where: {
            and: [
                {provider: {equals: provider}},
                {provider_account_id: {equals: provider_account_id}}
            ]
        },
        depth: 1,
        limit: 1,
        showHiddenFields: true
    })

    let user = accounts.docs[0]?.user;
    if (typeof user === 'number' || !user) {
        throw new Error("user is a number or not found");
    }

    const now = new Date();

    let sid: string = "";

    if (useSessions) {
        const validSession = (user.sessions ?? []).filter((s) => new Date(s.expiresAt) > now);
        sid = crypto.randomUUID();
    
        user = await payload.update({
            collection: "users",
            id: user.id,
            data: {
                sessions: [
                    ...validSession,
                    {
                        id: sid,
                        createdAt: now.toISOString(),
                        expiresAt: new Date(now.getTime() + tokenExpiration * 1000).toISOString()
                    }
                ]
            }
        })
    }


    const fieldsToSign = getFieldsToSign({
        collectionConfig: collectionConfig,
        email: email,
        sid: sid,
        user: user
    }); 

    const {token} = await jwtSign({
        fieldsToSign: fieldsToSign,
        secret: payload.secret,
        tokenExpiration: tokenExpiration
    })

    const cookies = generatePayloadCookie({
        collectionAuthConfig: collectionConfig.auth,
        cookiePrefix: payload.config.cookiePrefix,
        token
    })

    return cookies

}