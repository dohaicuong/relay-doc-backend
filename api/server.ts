import { createServer } from '@graphql-yoga/node'
import { schema } from './schema'

export const server = createServer({
  schema,
})
