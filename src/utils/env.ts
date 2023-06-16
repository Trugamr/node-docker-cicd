import { z } from 'zod'

declare global {
  // eslint-disable-next-line no-var
  var _env: z.infer<typeof envSchema> | undefined
}

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
})

if (!global._env) {
  global._env = envSchema.parse(process.env)
}

export const env = global._env
