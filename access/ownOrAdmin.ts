import { Access, AccessArgs } from "payload";
import {isAdmin} from "./admins";
import {isUser} from "./users"

const ownOrAdmin = (field: string) => ({req: {user}}: AccessArgs): ReturnType<Access> => {

    if (isAdmin(user)) return true;

    if (!isUser(user) || !user) return false;
    
    return {[field]: {equals: user.id}}
}

export default ownOrAdmin

// import { Access, AccessArgs } from "payload";
// import {isAdmin} from "./admins";
// import {isUser} from "./users"

// export default function ownOrAdmin({req: {user}}: AccessArgs): ReturnType<Access> {
//     if (isAdmin(user)) return true;
//     if (!isUser(user) || !user) return false;
//     return { [field]: { equals: user.id } };
// }

// const ownOrAdmin =
//   (field: string): Access =>
//   ({ req: { user } }) => {
//     if (isAdmin(user)) return true;
//     if (!isUser(user) || !user) return false;
//     return { [field]: { equals: user.id } };
//   };

// export default ownOrAdmin;

