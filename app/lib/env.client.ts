/**
 * Client-side environment variables validation schema.
 * Example:
 * NEXT_PUBLIC_VAR_NAME = z.string().min(1, "NEXT_PUBLIC_VAR_NAME is required");
 */
import { z } from 'zod'

export const EnvClientSchema = z.object({})

export const ENV_CLIENT = EnvClientSchema.parse(process.env)
