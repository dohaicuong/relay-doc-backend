import SchemaBuilder from '@pothos/core'

import ErrorsPlugin from '@pothos/plugin-errors'

import RelayPlugin, { GlobalIDShape } from '@pothos/plugin-relay'

import PrismaPlugin from '@pothos/plugin-prisma'
import type PrismaTypes from '@pothos/plugin-prisma/generated'
import { prisma } from './prisma'

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes
  Scalars: {
    DateTime: {
      Input: string
      Output: Date
    }
  }
}>({
  plugins: [ErrorsPlugin, RelayPlugin, PrismaPlugin],
  errorOptions: { defaultTypes: [Error] },
  relayOptions: {
    clientMutationId: 'omit',
    cursorType: 'String',
  },
  prisma: {
    client: prisma,
    filterConnectionTotalCount: true,
  },
})

const ErrorInterface = builder.interfaceRef<Error>('Error').implement({
  fields: (t) => ({
    message: t.exposeString('message'),
  }),
})

builder.objectType(Error, {
  name: 'BaseError',
  interfaces: [ErrorInterface],
  fields: (t) => ({
    message: t.exposeString('message')
  })
})

export class NotFoundError extends Error {
  message: string

  constructor(id?: { typename: string, id: string }) {
    super()
    
    this.name = 'NotFoundError'

    if (id) {
      this.message = `NotFound ${id.typename} with ${id.id}`
    }
    else {
      this.message = 'NotFoundError'
    }
  }
}

builder.objectType(NotFoundError, {
  name: 'NotFoundError',
  interfaces: [ErrorInterface],
  fields: t => ({
    name: t.exposeString('name'),
    message: t.exposeString('message'),
  })
})

builder.scalarType('DateTime', {
  serialize: n => n.toISOString(),
  parseValue: n => new Date(n as any).toISOString(),
})

builder.queryType()
builder.mutationType()
