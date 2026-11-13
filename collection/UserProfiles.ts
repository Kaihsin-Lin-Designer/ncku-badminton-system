import { CollectionConfig } from "payload";
import ownOrAdmin from "@/access/ownOrAdmin";
import adminsOnly, {isAdmin} from "@/access/admins";

const UserProfiles: CollectionConfig = {
    slug: "user_profiles",
    admin: {
        useAsTitle: "full_name",
        defaultColumns: ["full_name", "department", "class_of"]
    },
    fields: [
        {
            name: "user",
            type: "relationship",
            relationTo: "users",
            required: true,
            unique: true
        },
        {
            name: "family_name",
            label: "姓",
            type: "text",
            required: true,
            maxLength: 32
        },
        {
            name: "given_name",
            label: "名字",
            type: "text",
            required: true,
            maxLength: 32
        },
        {
            name: 'full_name',
            type: 'text',
            index: true,
            admin: { hidden: true },
            hooks: {
                beforeChange: [
                ({ siblingData }) =>
                    `${siblingData.family_name ?? ''}${siblingData.given_name ?? ''}`,
                ],
            },
        },
        {
            name: "nickname",
            label: "暱稱",
            type: "text",
            maxLength: 32
        },
        {
            name: "birthday",
            label: "生日",
            type: "date",
            required: true
        },
        {
            name: "department",
            label: "系所",
            type: "relationship",
            relationTo: "departments",
            required: true,
        },
        {
            name: "class_of",
            label: "系級",
            type: "number",
            max: 999,
        }
    ]
}

export default UserProfiles