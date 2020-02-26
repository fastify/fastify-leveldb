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
})

test('throw on database open error v2', t => {
  t.plan(3)

  const fastify = Fastify()
  fastify
    .register(level, { name: '/test' })
    .ready(err => {
      t.ok(err)
      t.equal(err.message, 'IO error: /test/LOCK: No such file or directory')
      t.pass('cannot write to /test, as expected')
    })
})

test('level namespace should exist', t => {
  t.plan(3)

  const fastify = Fastify()
  fastify
    .register(level, { name: 'test' })
    .ready(err => {
      t.error(err)
      t.ok(fastify.level)
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
      fastify.level.put('a', 'b', err => {
        t.error(err)
        fastify.level.get('a', (err, val) => {
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
    .register(level, { options: { store: memdown } })
    .ready(err => {
      t.error(err)
      fastify.level.put('a', 'b', err => {
        t.error(err)
        fastify.level.get('a', (err, val) => {
          t.error(err)
          t.equal(val, 'b')
          fastify.close(() => {
            t.pass('unlock')
          })
        })
      })
    })
})
