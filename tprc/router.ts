import { t } from './builder'

export const appRouter = t.router({
  hello: t.procedure
    .query(() => {
      return {
        greeting: `hello world`,
      };
    }),
})

export type AppRouter = typeof appRouter
