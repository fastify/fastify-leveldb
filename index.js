'use strict'

const fp = require('fastify-plugin')
const levelup = require('levelup')
const leveldown = require('leveldown')
const encode = require('encoding-down')

// mostly from level-packager
function levelMore (location, options, next) {
  const store = options.store || leveldown
  delete options.store
  for (const m of ['destroy', 'repair']) {
    if (typeof store[m] === 'function') {
      levelMore[m] = store[m].bind(store)
    }
  }

  return levelup(encode(store(location), options), options, next)
}

levelMore.errors = levelup.errors

function levelPlugin (fastify, opts, next) {
  if (!opts.name) {
    return next(new Error('Missing database name'))
  }

  const { name, path } = opts
  opts.options = opts.options || {}

  if (!fastify.hasDecorator('level')) {
    fastify.decorate('level', {})
  }

  if (fastify.level[name]) {
    return next(new Error(`Level namespace already used: ${name}`))
  }

  fastify.addHook('onClose', (instance, done) => {
    instance.level[name].close(done)
  })

  fastify.level[name] = levelMore(path || name, opts.options, next)
}

module.exports = fp(levelPlugin, {
  fastify: '^3.0.0',
  name: 'fastify-leveldb'
})
