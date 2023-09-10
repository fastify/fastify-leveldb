'use strict'

const t = require('tap')
const { existsSync } = require('node:fs')
const test = t.test
const rimraf = require('rimraf')
const Fastify = require('fastify')
const memdown = require('memdown')
const fastifyLeveldb = require('..')

t.teardown(() => {
  rimraf.sync('./test_db')
  rimraf.sync('./foo')
  rimraf.sync('./bar')
})

test('level namespace should exist', t => {
  t.plan(3)

  const fastify = Fastify()
  fastify
    .register(fastifyLeveldb, { name: 'test_db' })
    .ready(err => {
      t.error(err)
      t.ok(fastify.level.test_db)
      fastify.close(() => {
        t.pass('unlock')
      })
    })
})

test('missing database name', t => {
  t.plan(1)

  const fastify = Fastify()
  fastify
    .register(fastifyLeveldb, { name: undefined })
    .ready(err => {
      t.equal(err.message, 'Missing database name')
    })
})

test('level should support leveldb operations', t => {
  t.plan(5)

  const fastify = Fastify()
  fastify
    .register(fastifyLeveldb, { name: 'test_db' })
    .ready(err => {
      t.error(err)
      fastify.level.test_db.put('a', 'b', err => {
        t.error(err)
        fastify.level.test_db.get('a', (err, val) => {
          t.error(err)
          t.equal(val, 'b')
          fastify.close(() => {
            t.pass('unlock')
          })
        })
      })
    })
})

test('level should support other stores (memdown)', t => {
  t.plan(5)

  const fastify = Fastify()
  fastify
    .register(fastifyLeveldb, { name: 'test_db', options: { store: memdown } })
    .ready(err => {
      t.error(err)
      fastify.level.test_db.put('a', 'b', err => {
        t.error(err)
        fastify.level.test_db.get('a', (err, val) => {
          t.error(err)
          t.equal(val, 'b')
          fastify.close(() => {
            t.pass('unlock')
          })
        })
      })
    })
})

test('level should support leveldb operations (async await)', async t => {
  t.plan(1)
  const fastify = Fastify()
  await fastify.register(fastifyLeveldb, { name: 'test_db' })
  await fastify.level.test_db.put('a', 'b')
  const val = await fastify.level.test_db.get('a')
  t.equal(val, 'b')
  await fastify.close()
})

test('namespaces', async t => {
  t.plan(2)
  const fastify = Fastify()
  await fastify.register(fastifyLeveldb, { name: 'foo' })
  await fastify.register(fastifyLeveldb, { name: 'bar' })
  await fastify.level.foo.put('a', 'b')
  await fastify.level.bar.put('a', 'b')
  t.equal(await fastify.level.foo.get('a'), 'b')
  t.equal(await fastify.level.bar.get('a'), 'b')
  await fastify.close()
})

test('reuse namespaces', t => {
  t.plan(2)
  const fastify = Fastify()
  fastify.register(fastifyLeveldb, { name: 'foo' })
  fastify.register(fastifyLeveldb, { name: 'foo' })
  fastify.ready(err => {
    t.equal(err.message, 'Level namespace already used: foo')
    fastify.close(() => t.pass('closed'))
  })
})

test('store json', async t => {
  t.plan(1)
  const fastify = Fastify()
  await fastify.register(fastifyLeveldb, {
    name: 'test_db',
    options: { valueEncoding: 'json' }
  })
  await fastify.level.test_db.put('greeting', { hello: 'world' })
  t.same(await fastify.level.test_db.get('greeting'), { hello: 'world' })
  await fastify.close()
})

test('custom path', async t => {
  t.plan(4)
  const fastify = Fastify()
  await fastify.register(fastifyLeveldb, { name: 'first', path: 'foo' })
  await fastify.register(fastifyLeveldb, { name: 'second', path: 'bar' })
  await fastify.level.first.put('a', 'b')
  await fastify.level.second.put('a', 'b')
  t.equal(await fastify.level.second.get('a'), 'b')
  t.equal(await fastify.level.second.get('a'), 'b')
  t.ok(existsSync('./foo'))
  t.ok(existsSync('./bar'))
  await fastify.close()
})
