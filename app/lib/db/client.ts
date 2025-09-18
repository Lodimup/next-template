import { drizzle } from 'drizzle-orm/node-postgres'

import { ENV_SERVER } from '@/lib/env.server'
import * as schema from './schema'

export const db = drizzle(ENV_SERVER.DATABASE_URL, { schema })
