import { Prisma } from '@prisma/client'
import { builder, NotFoundError } from './builder'
import { prisma } from './prisma'

const Task = builder.prismaNode('Task', {
  id: { resolve: task => task.id },
  findUnique: id => ({ id }),
  fields: t => ({
    content: t.exposeString('content'),
    isDone: t.exposeBoolean('isDone'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  })
})

builder.queryField('taskConnection', t => t.prismaConnection({
  type: 'Task',
  cursor: 'id',
  resolve: query => prisma.task.findMany(query)
}))

builder.relayMutationField('taskCreate',
  {
    inputFields: t => ({
      content: t.string({ required: true }),
    }),
  },
  {
    errors: { types: [Error] },
    resolve: async (_, { input }) => {
      return prisma.task.create({ data: input })
    }
  },
  {
    outputFields: t => ({
      task: t.field({
        type: Task,
        resolve: task => task
      })
    })
  }
)

builder.relayMutationField('taskDone',
  {
    inputFields: t => ({
      id: t.globalID({ required: true })
    })
  },
  {
    errors: { types: [Error, NotFoundError] },
    resolve: async (_, { input }) => {
      try {
        const task = await prisma.task.update({
          where: { id: input.id.id },
          data: { isDone: true }
        })
        return task
      }
      catch(e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2025') throw new NotFoundError(input.id)
        }
        throw e
      }
    }
  },
  {
    outputFields: t => ({
      task: t.field({
        type: Task,
        resolve: task => task
      })
    })
  }
)

builder.relayMutationField('taskUndone',
  {
    inputFields: t => ({
      id: t.globalID({ required: true })
    })
  },
  {
    errors: { types: [NotFoundError] },
    resolve: async (_, { input }) => {
      try {
        const task = await prisma.task.update({
          where: { id: input.id.id },
          data: { isDone: false }
        })
        return task
      }
      catch(e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2025') throw new NotFoundError(input.id)
        }
        throw e
      }
    }
  },
  {
    outputFields: t => ({
      task: t.field({
        type: Task,
        resolve: task => task
      })
    })
  }
)

builder.relayMutationField('taskDelete',
  {
    inputFields: t => ({
      id: t.globalID({ required: true })
    })
  },
  {
    errors: { types: [NotFoundError] },
    resolve: async (_, { input }) => {
      try {
        const task = await prisma.task.delete({
          where: { id: input.id.id },
        })
        return task
      }
      catch(e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2025') throw new NotFoundError(input.id)
        }
        throw e
      }
    }
  },
  {
    outputFields: t => ({
      task: t.field({
        type: Task,
        resolve: task => task
      })
    })
  }
)

export const schema = builder.toSchema()
