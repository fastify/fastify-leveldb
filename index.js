'use strict'

const fp = require('fastify-plugin')
const levelup = require('levelup')
const leveldown = require('leveldown')
const encode = require('encoding-down')

// mostly from level-packager
const levelMore = (location, options) => {
  if (typeof options !== 'object' || options === null) options = {}
  const store = options.store || leveldown
  delete options.store
  ;[ 'destroy', 'repair' ].forEach(function (m) {
    if (typeof store[m] === 'function') {
      levelMore[m] = () => store[m].apply(store, arguments)
    }
  })

  return levelup(encode(store(location), options), options)
}

levelMore.errors = levelup.errors

function levelPlugin (fastify, opts, next) {
  if (!opts.name && (!opts.options || !opts.options.store)) {
    return next(new Error('Missing database name'))
  }
  opts.options = opts.options || {}

  fastify
    .decorate('level', levelMore(opts.name, opts.options))
    .addHook('onClose', close)

  next()
}

function close (fastify, done) {
  fastify.level.close(done)
}

module.exports = fp(levelPlugin, {
  fastify: '>=1.0.0',
  name: 'fastify-leveldb'
})
