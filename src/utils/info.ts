import fs from 'node:fs/promises'
import path from 'node:path'
import { z } from 'zod'

const infoSchema = z.object({
  version: z.string(),
})

declare global {
  // eslint-disable-next-line no-var
  var _info: z.infer<typeof infoSchema> | undefined
}

if (!global._info) {
  // We are reading file using fs instead of importing so that package.json is not bundled in the final build
  const file = await fs.readFile(path.resolve('package.json'), 'utf-8')
  const json = JSON.parse(file)
  global._info = infoSchema.parse(json)
}

export const info = global._info
