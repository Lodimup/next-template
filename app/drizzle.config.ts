import { defineConfig } from 'drizzle-kit'
import { ENV_SERVER } from './lib/env.server'

export default defineConfig({
    out: './drizzle',
    schema: 'lib/db/schema/index.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: ENV_SERVER.DATABASE_URL,
        ssl: false,
    },
})
