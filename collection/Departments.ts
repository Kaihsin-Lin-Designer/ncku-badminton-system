import { CollectionConfig } from "payload";
import ownOrAdmin from "@/access/ownOrAdmin";
import adminsOnly, {isAdmin} from "@/access/admins";
import { isUserAdmin, isUserVerified } from "@/access/users";

const Departments: CollectionConfig = {
    slug: "departments",
    admin: {
        useAsTitle: "name"
    },
    fields: [
        {
            name: "name",
            type: "text",
            required: true,
            maxLength: 32
        },
        {
            name: "acronym",
            type: "text",
            required: true,
            maxLength: 8
        }
    ],
    access: {
        create: ({req}) => isUserVerified({req}) || isAdmin({req}) || isUserAdmin({req}),
        read: ({req}) => isUserVerified({req}) || isAdmin({req}) || isUserAdmin({req}),
        update: ({req}) => isAdmin({req}) || isUserAdmin({req}),
        delete: ({req}) => isAdmin({req}) || isUserAdmin({req}),
    }
}

export default Departments;