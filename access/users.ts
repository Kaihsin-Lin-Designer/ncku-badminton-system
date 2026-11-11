import { Access, AccessArgs } from "payload";

export default function usersOnly({req: {user}}: AccessArgs): ReturnType<Access> {
    return isUser(user);
}

export function isUser(user: AccessArgs["req"]["user"]): boolean {
    if (user?.collection !== "users") return false;

    return true;
}