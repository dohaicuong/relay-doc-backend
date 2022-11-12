import { createYoga } from 'graphql-yoga'
import { schema } from '../server/schema'

export const config = {
  api: { bodyParser: false }
}

export default createYoga({
  graphqlEndpoint: '/api/graphql',
  schema,
})
