# fastify-leveldb

[![Greenkeeper badge](https://badges.greenkeeper.io/fastify/fastify-leveldb.svg)](https://greenkeeper.io/)

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)  [![Build Status](https://travis-ci.org/fastify/fastify-leveldb.svg?branch=master)](https://travis-ci.org/fastify/fastify-leveldb)


Fastify LevelDB connection plugin, with this you can share the same Level connection in every part of your server.

Under the hood [Levelup](https://github.com/Level/levelup) is used, the options that you pass to register will be passed to Levelup.

This plugin works with `level@5.x.x`. If you need `level@4.x.x` install the version `1.x.x` of this plugin.

## Install
```
npm i fastify-leveldb --save
```
## Usage
Add it to you project with `register` and you are done!
You can access LevelDB via `fastify.level`.
```js
const fastify = require('fastify')()

fastify.register(require('fastify-leveldb'), {
  name: 'db'
}, err => {
  if (err) throw err
})

fastify.get('/foo', (req, reply) => {
  const { level } = fastify
  level.get(req.query.key, (err, val) => {
    reply.send(err || val)
  })
})

fastify.post('/foo', (req, reply) => {
  const { level } = fastify
  level.put(req.body.key, req.body.value, (err) => {
    reply.send(err || { status: 'ok' })
  })
})

fastify.listen(3000, err => {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})
```

By default, [Leveldown](https://github.com/Level/leveldown) is used for the store but you can use any [Abstact-leveldown](https://github.com/Level/abstract-leveldown/) compliant store, such as [memdown](https://github.com/Level/memdown).

First, you must install the store:

```sh
npm install memdown
```

Next, initialize the plugin with the given store:

```js
fastify.register(require('fastify-leveldb'), {
  options: {
    store: require('memdown')
  }
}, err => {
  if (err) throw err
})
```

## Acknowledgements

This project is kindly sponsored by:
- [nearForm](http://nearform.com)
- [LetzDoIt](http://www.letzdoitapp.com/)

## License

Licensed under [MIT](./LICENSE).
