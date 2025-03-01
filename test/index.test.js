'use strict'

const { test, after } = require('node:test')
const { existsSync } = require('node:fs')
const rimraf = require('rimraf')
const Fastify = require('fastify')
const memdown = require('memdown')
const fastifyLeveldb = require('..')

after(() => {
  rimraf.sync('./test_db')
  rimraf.sync('./foo')
  rimraf.sync('./bar')
})

test('level namespace should exist', async t => {
  t.plan(1)

  const fastify = Fastify()
  await fastify.register(fastifyLeveldb, { name: 'test_db' }).ready()

  t.assert.ok(fastify.level.test_db)
  return fastify.close()
})

test('missing database name', async t => {
  t.plan(1)

  const fastify = Fastify()
  await t.assert.rejects(() => fastify
    .register(fastifyLeveldb, { name: undefined })
    .ready(), undefined, 'Missing database name')
})

test('level should support leveldb operations', async t => {
  t.plan(1)

  const fastify = Fastify()
  await fastify
    .register(fastifyLeveldb, { name: 'test_db' })
    .ready()

  await fastify.level.test_db.put('a', 'b')
  const val = await fastify.level.test_db.get('a')
  t.assert.deepStrictEqual(val, 'b')
  return fastify.close()
})

test('level should support other stores (memdown)', async t => {
  t.plan(1)

  const fastify = Fastify()
  await fastify
    .register(fastifyLeveldb, { name: 'test_db', options: { store: memdown } })
    .ready()

  await fastify.level.test_db.put('a', 'b')

  const val = await fastify.level.test_db.get('a')
  t.assert.deepStrictEqual(val, 'b')
  return fastify.close()
})

test('level should support leveldb operations (async await)', async t => {
  t.plan(1)
  const fastify = Fastify()
  await fastify.register(fastifyLeveldb, { name: 'test_db' })
  await fastify.level.test_db.put('a', 'b')
  const val = await fastify.level.test_db.get('a')
  t.assert.deepStrictEqual(val, 'b')
  return fastify.close()
})

test('namespaces', async t => {
  t.plan(2)
  const fastify = Fastify()
  await fastify.register(fastifyLeveldb, { name: 'foo' })
  await fastify.register(fastifyLeveldb, { name: 'bar' })
  await fastify.level.foo.put('a', 'b')
  await fastify.level.bar.put('a', 'b')
  t.assert.deepStrictEqual(await fastify.level.foo.get('a'), 'b')
  t.assert.deepStrictEqual(await fastify.level.bar.get('a'), 'b')
  return fastify.close()
})

test('reuse namespaces', async t => {
  t.plan(1)
  const fastify = Fastify()
  fastify.register(fastifyLeveldb, { name: 'foo' })
  fastify.register(fastifyLeveldb, { name: 'foo' })
  await t.assert.rejects(() => fastify.ready(), undefined, 'Level namespace already used: foo')
  return fastify.close()
})

test('store json', async t => {
  t.plan(1)
  const fastify = Fastify()
  await fastify.register(fastifyLeveldb, {
    name: 'test_db',
    options: { valueEncoding: 'json' }
  })
  await fastify.level.test_db.put('greeting', { hello: 'world' })
  t.assert.deepStrictEqual(await fastify.level.test_db.get('greeting'), { hello: 'world' })
  return fastify.close()
})

test('custom path', async t => {
  t.plan(4)
  const fastify = Fastify()
  await fastify.register(fastifyLeveldb, { name: 'first', path: 'foo' })
  await fastify.register(fastifyLeveldb, { name: 'second', path: 'bar' })
  await fastify.level.first.put('a', 'b')
  await fastify.level.second.put('a', 'b')
  t.assert.deepStrictEqual(await fastify.level.second.get('a'), 'b')
  t.assert.deepStrictEqual(await fastify.level.second.get('a'), 'b')
  t.assert.ok(existsSync('./foo'))
  t.assert.ok(existsSync('./bar'))
  return fastify.close()
})
