/**
 * Server-side environment variables validation schema.
 */

import { z } from 'zod'
import { EnvClientSchema } from './env.client'

const EnvServerOnlySchema = z.object({
    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.string(),
    DATABASE_URL: z.url(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
})

const envServerSchema = EnvServerOnlySchema.extend(EnvClientSchema.shape)

export const ENV_SERVER = envServerSchema.parse(process.env)
