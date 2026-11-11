import { CollectionConfig } from "payload";
import ownOrAdmin from "@/access/ownOrAdmin";
import adminsOnly from "@/access/admins";

const Accounts: CollectionConfig = {
    slug: "accounts",
    fields: [
        {
            name: "user",
            type: "relationship",
            relationTo: "users",
            required: true,
            index: true
        },
        {
            name: "provider",
            type: "select",
            options: [
                {
                    label: "Google",
                    value: "google"
                }
            ],
            required: true
        },
        {
            name: "provider_account_id",
            type: "text",
            required: true
        },
        // {
        //     name: "verified",
        //     type: "checkbox",
        //     defaultValue: false,
        //     required: true
        // }
    ],
    indexes: [
        {
            fields: ["user", "provider"],
            unique: true,
        },
        {
            fields: ["provider", "provider_account_id"],
            unique: true
        }
    ],
    access: {
        create: adminsOnly,
        read: ownOrAdmin("user"),
        update: ownOrAdmin("user"),
        delete: ownOrAdmin("user")
    }
}

export default Accounts