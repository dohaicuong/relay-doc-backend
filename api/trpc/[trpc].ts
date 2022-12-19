import * as trpcNext from '@trpc/server/adapters/next'
import { appRouter } from '../../tprc/router'

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
})
