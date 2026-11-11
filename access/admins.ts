import { Access, AccessArgs } from "payload";

export default function adminsOnly({req: {user}}: AccessArgs): ReturnType<Access> {
    return isAdmin(user);
}

export function isAdmin(user: AccessArgs["req"]["user"]) {
    if (user?.collection !== "admins") return false;

    return true;
}