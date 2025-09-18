import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from './db/client'
import { ENV_SERVER } from './env.server'

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
    }),
    socialProviders: {
        google: {
            clientId: ENV_SERVER.GOOGLE_CLIENT_ID,
            clientSecret: ENV_SERVER.GOOGLE_CLIENT_SECRET,
        },
    },
})
