'use strict'

const t = require('tap')
const test = t.test
const rimraf = require('rimraf')
const Fastify = require('fastify')
const memdown = require('memdown')
const level = require('./')

t.tearDown(() => {
  rimraf('./test', err => {
    if (err) throw err
  })

  rimraf('./foo', err => {
    if (err) throw err
  })

  rimraf('./bar', err => {
    if (err) throw err
  })
})

test('level namespace should exist', t => {
  t.plan(3)

  const fastify = Fastify()
  fastify
    .register(level, { name: 'test' })
    .ready(err => {
      t.error(err)
      t.ok(fastify.level.test)
      fastify.close(() => {
        t.pass('unlock')
      })
    })
})

test('level should support leveldb operations', t => {
  t.plan(5)

  const fastify = Fastify()
  fastify
    .register(level, { name: 'test' })
    .ready(err => {
      t.error(err)
      fastify.level.test.put('a', 'b', err => {
        t.error(err)
        fastify.level.test.get('a', (err, val) => {
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
    .register(level, { name: 'test', options: { store: memdown } })
    .ready(err => {
      t.error(err)
      fastify.level.test.put('a', 'b', err => {
        t.error(err)
        fastify.level.test.get('a', (err, val) => {
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
  await fastify.register(level, { name: 'test' })
  await fastify.level.test.put('a', 'b')
  const val = await fastify.level.test.get('a')
  t.equal(val, 'b')
  await fastify.close()
})

test('namespaces', async t => {
  t.plan(2)
  const fastify = Fastify()
  await fastify.register(level, { name: 'foo' })
  await fastify.register(level, { name: 'bar' })
  await fastify.level.foo.put('a', 'b')
  await fastify.level.bar.put('a', 'b')
  t.equal(await fastify.level.foo.get('a'), 'b')
  t.equal(await fastify.level.bar.get('a'), 'b')
  await fastify.close()
})

test('reuse namespaces', t => {
  t.plan(1)
  const fastify = Fastify()
  fastify.register(level, { name: 'foo' })
  fastify.register(level, { name: 'foo' })
  fastify.ready(err => {
    t.is(err.message, 'Level namespace already used: foo')
  })
})

test('store json', async t => {
  t.plan(1)
  const fastify = Fastify()
  await fastify.register(level, {
    name: 'test',
    options: { valueEncoding: 'json' }
  })
  await fastify.level.test.put('greeting', { hello: 'world' })
  t.deepEqual(await fastify.level.test.get('greeting'), { hello: 'world' })
  await fastify.close()
})
