import sharp from 'sharp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { buildConfig } from 'payload'
import { resendAdapter } from '@payloadcms/email-resend'

import Admins from './collection/Admins'
import Users from "./collection/Users"
import Accounts from './collection/Accounts'
import Departments from './collection/Departments'
import UserProfiles from './collection/UserProfiles'

export default buildConfig({
  // If you'd like to use Rich Text, pass your editor here
  editor: lexicalEditor(),

  // Define and configure your collections in this array
  collections: [
    Admins,
    Users,
    Accounts,
    UserProfiles,
    Departments
  ],

  admin: {
    user: 'admins'
  },

  // Your Payload secret - should be a complex and secure string, unguessable
  secret: process.env.PAYLOAD_SECRET || '',
  // Whichever Database Adapter you're using should go here
  // Mongoose is shown as an example, but you can also use Postgres
  db: postgresAdapter({
    pool: {
        connectionString: process.env.DATABASE_URL || '',
    }
  }),
  email: resendAdapter({
    defaultFromAddress: 'mail@ncku-badminton.org',
    defaultFromName: 'NCKU Badminton 成大羽球暨校友會',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  // If you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.
  // This is optional - if you don't need to do these things,
  // you don't need it!
  sharp,
})