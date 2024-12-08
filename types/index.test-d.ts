import fastify from 'fastify'
import { LevelUp } from 'levelup'
import { expectAssignable, expectDeprecated, expectType } from 'tsd'
import fastifyLeveldb, { FastifyLeveldbOptions, LevelDBOptions } from '..'

const app = fastify()

app
  .register(fastifyLeveldb, {
    name: 'test',
    path: '.local'
  })
  .after(async (err) => {
    expectType<LevelUp>(app.level.test)
  })

expectDeprecated({} as LevelDBOptions)
expectAssignable<FastifyLeveldbOptions>({} as LevelDBOptions)
