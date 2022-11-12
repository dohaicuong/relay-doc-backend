import { createYoga } from 'graphql-yoga'
import { schema } from '../server/schema'
import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: { bodyParser: false }
}

export default createYoga<{
  req: NextApiRequest
  res: NextApiResponse
}>({
  graphqlEndpoint: '/api/graphql',
  schema,
})
