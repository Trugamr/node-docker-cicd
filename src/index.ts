import 'dotenv/config'
import Fastify from 'fastify'
import { env } from './utils/env.js'
import { info } from './utils/info.js'

// Create a server instance
const app = Fastify({
  logger: true,
})

// Declare routes
app.get('/', async (request, reply) => {
  reply.send({ hello: 'world', version: info.version })
})

// Start the server
await app.listen({
  port: env.PORT,
  host: '0.0.0.0',
})

// Handle graceful shutdown
const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'] as const
for (const signal of signals) {
  process.on(signal, async () => {
    await app.close()
    process.exit(0)
  })
}
