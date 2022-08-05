# @fastify/leveldb

![CI](https://github.com/fastify/fastify-leveldb/workflows/CI/badge.svg)
[![NPM version](https://img.shields.io/npm/v/@fastify/leveldb.svg?style=flat)](https://www.npmjs.com/package/@fastify/leveldb)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://standardjs.com/)


Fastify LevelDB connection plugin, with this you can share the same Level connection in every part of your server.

Under the hood [Levelup](https://github.com/Level/levelup) is used, the options that you pass to register will be passed to Levelup.

## Install
```
npm i @fastify/leveldb
```

## Usage
Add it to you project with `register`, configure the database name and you are done!

You can access LevelDB via `fastify.level[name]`.
```js
const fastify = require('fastify')()

fastify.register(
  require('@fastify/leveldb'),
  { name: 'db' }
)

fastify.get('/foo', async function (req, reply) {
  const val = await this.level.db.get(req.query.key)
  return val
})

fastify.post('/foo', async function (req, reply) {
  await this.level.db.put(req.body.key, req.body.value)
  return { status: 'ok' }
})

fastify.listen({ port: 3000 }, err => {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})
```

By default, [Leveldown](https://github.com/Level/leveldown) is used for the store but you can use any [Abstact-leveldown](https://github.com/Level/abstract-leveldown/) compliant store, such as [memdown](https://github.com/Level/memdown).

First, you must install the store:

```sh
npm i memdown
```

Next, initialize the plugin with the given store:

```js
fastify.register(require('@fastify/leveldb'), {
  name: 'db',
  options: {
    store: require('memdown')
  }
})
```

By default the path where the db will be created is the name option, but you can also pass a custom path as well.
```js
fastify.register(
  require('@fastify/leveldb'),
  { name: 'db', path: '.local' }
)
```

## Acknowledgements

This project is kindly sponsored by:
- [nearForm](https://nearform.com)
- [LetzDoIt](https://www.letzdoitapp.com/)

## License

Licensed under [MIT](./LICENSE).
