import { FastifyPluginCallback } from 'fastify'
import { LevelUp } from 'levelup'

declare module 'fastify' {
  interface FastifyInstance {
    level: {
      [key: string]: LevelUp
    }
  }
}

type FastifyLeveldb = FastifyPluginCallback<fastifyLeveldb.FastifyLeveldbOptions>

declare namespace fastifyLeveldb {
  export interface FastifyLeveldbOptions {
    name: string,
    path: string
  }
  /**
   * @deprecated Use FastifyLeveldbOptions instead
   */
  export type LevelDBOptions = FastifyLeveldbOptions

  export const fastifyLeveldb: FastifyLeveldb
  export { fastifyLeveldb as default }
}

declare function fastifyLeveldb (...params: Parameters<FastifyLeveldb>): ReturnType<FastifyLeveldb>
export = fastifyLeveldb
