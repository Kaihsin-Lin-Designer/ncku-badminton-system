import { CollectionConfig } from "payload";
import ownOrAdmin from "@/access/ownOrAdmin";
import adminsOnly, {isAdmin} from "@/access/admins";
import { isUserAdmin, isUserVerified } from "@/access/users";

const Users: CollectionConfig = {
    slug: "users",
    auth: {
        verify: true,
        maxLoginAttempts: 5,
        lockTime: 60 * 5 * 1000,
    },
    admin: {
        useAsTitle: "email",
    },
    fields: [
        {
            name: "email_verified_at",
            type: "date",
            required: false
        },
        {
            name: "review_status",
            type: "select",
            options: [
                "not_started",
                "reviewing",
                "returning",
                "rejected",
                "approved",
                "suspended"
            ],
            defaultValue: "not_started",
            required: true,
            access: {
                create: ({ req }) => isAdmin({req}) || isUserAdmin({req}),
                read: ({ req }) => isAdmin({req}) || isUserAdmin({req}),
                update: ({ req }) => isAdmin({req}) || isUserAdmin({req}),
            },
        },
        {
            name: "roles",
            type: "select",
            hasMany: true,
            options: [
                {value: "admin", label: "管理員"},
                {value: "member_reviewer", label: "校友審核者"},
                {value: "event_reviewer", label: "活動審核者"},
                {value: "financial _reviewer", label: "財務審核者"},
                {value: "board_member", label: "理事"},
                {value: "member", label: "校友"},
            ],
            required: true,
            defaultValue: "member",
            access: {
                create: ({req}) => isAdmin({req}) || isUserAdmin({req}),
                read: ({req}) => isUserVerified({req}) || isAdmin({req}) || isUserAdmin({req}),
                update: ({req}) => isAdmin({req}) || isUserAdmin({req}),
            }
        },
        // {
        //     name: "profile",
        //     type: "join",
        //     collection: "user_profiles",
        //     on: "user"
        // }
    ],
    access: {
        create: ({req}) => isAdmin({req}) || isUserAdmin({req}),
        read: ({req}) => ownOrAdmin("id")({req}) || isUserAdmin({req}),
        update: ({req}) => isAdmin({req}) || isUserAdmin({req}),
        delete: ({req}) => isAdmin({req}) || isUserAdmin({req}),
    }
}

export default Users