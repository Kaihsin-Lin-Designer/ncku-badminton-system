import type { CollectionConfig } from 'payload';

const Admins: CollectionConfig = {
    slug: 'admins',
    auth: {
        tokenExpiration: 7200,
        maxLoginAttempts: 5,
        lockTime: 60 * 60,
    },
    fields: [
        {
            type: "text",
            name: "admin-name"
        }
    ]
}

export default Admins;