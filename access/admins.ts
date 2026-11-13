import { Access, AccessArgs } from "payload";

export default function adminsOnly({req}: AccessArgs): ReturnType<Access> {
    return isAdmin({req});
}

export function isAdmin({req}: AccessArgs) {
    if (req.user?.collection !== "admins") return false;

    return true;
}