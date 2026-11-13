'use server'
import { getPayload, PaginatedDocs } from 'payload'
import config from "@payload-config"
import { User, UserProfile } from '@/payload-types';
import { payloadGetLocalReq } from '../auth/payload-common';
import { isUserVerified } from '@/access/users';
import { redirectLogin } from '../auth/utils';

//// /// /// / 
export async function payloadQueryAllUsers() {
    const payload = await getPayload({config});

    const req = await payloadGetLocalReq(payload);

    if (!req || !isUserVerified({req})) redirectLogin("login-required");

    

    await payload.find({
        collection: "user_profiles",
        select: {
            fullName: true,
            nickname: true
        }
    })
}


export async function payloadQueryUsers(searchString: string, limit: number = 10): Promise<UserProfile[] | null> {
    const payload = await getPayload({config});

    const req = await payloadGetLocalReq(payload);

    if (!req || !isUserVerified({req})) return null;

    if (limit <= 0) limit = 1;
    if (limit >= 100) limit = 100;

    

    const result = await payload.find({
        collection: "user_profiles",
        // select: {
        //     full_name: true,
        //     nickname: true,
        //     user: true
        // },
        where: {
            or: [
                {full_name: {like: searchString}},
                {nickname: {like: searchString}},
                {"user.email": {equals: searchString}},
            ]
        },
        limit: limit
    })

    return result.docs
}