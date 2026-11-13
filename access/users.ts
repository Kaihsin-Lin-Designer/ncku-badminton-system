import { User } from "@/payload-types";
import { Access, AccessArgs } from "payload";

export default function usersOnly({req: {user}}: AccessArgs): ReturnType<Access> {
    return isUser(user);
}

export function isUser(user: AccessArgs["req"]["user"]): boolean {
    if (user?.collection !== "users") return false;

    return true;
}

export function isUserVerified({req}: AccessArgs): boolean {
    if ( req.user?.collection === "users" && req.user._verified) return true;
    else return false;
}

export function isUserAdmin({req}: AccessArgs): boolean {
    if ( req.user?.collection === "users") {
        const admin = req.user.roles.find((role) => role === "admin");
        return admin !== undefined;
    }
    else return false
}