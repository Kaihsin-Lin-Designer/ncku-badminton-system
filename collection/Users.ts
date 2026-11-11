import { CollectionConfig } from "payload";
import ownOrAdmin from "@/access/ownOrAdmin";
import adminsOnly, {isAdmin} from "@/access/admins";

const Users: CollectionConfig = {
    slug: "users",
    auth: {
        verify: true,
        maxLoginAttempts: 5,
        lockTime: 60 * 5 * 1000,
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
                "review",
                "returning",
                "rejected",
                "approved"
            ],
            defaultValue: "not_started",
            required: true,
            access: {
                create: ({ req: { user } }) => isAdmin(user),
                update: ({ req: { user } }) => isAdmin(user),
            },
        }
    ],
    access: {
        create: () => true,
        read: ownOrAdmin("id"),
        update: adminsOnly,
        delete: adminsOnly
    }
}

export default Users