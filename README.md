# @fastify/leveldb

[![CI](https://github.com/fastify/fastify-leveldb/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/fastify/fastify-leveldb/actions/workflows/ci.yml)
[![NPM version](https://img.shields.io/npm/v/@fastify/leveldb.svg?style=flat)](https://www.npmjs.com/package/@fastify/leveldb)
[![neostandard javascript style](https://img.shields.io/badge/code_style-neostandard-brightgreen?style=flat)](https://github.com/neostandard/neostandard)


Fastify LevelDB connection plugin, with this you can share the same Level connection in every part of your server.

Under the hood [Levelup](https://github.com/Level/levelup) is used, the options that you pass to register will be passed to Levelup.

## Install
```
npm i @fastify/leveldb
```

### Compatibility
| Plugin version | Fastify version |
| ---------------|-----------------|
| `^6.x`         | `^5.x`          |
| `^5.x`         | `^4.x`          |
| `^3.x`         | `^3.x`          |
| `^0.x`         | `^2.x`          |
| `^0.x`         | `^1.x`          |

Please note that if a Fastify version is out of support, then so are the corresponding versions of this plugin
in the table above.
See [Fastify's LTS policy](https://github.com/fastify/fastify/blob/main/docs/Reference/LTS.md) for more details.

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

## Acknowledgments

This project is kindly sponsored by:
- [nearForm](https://nearform.com)
- [LetzDoIt](https://www.letzdoitapp.com/)

## License

Licensed under [MIT](./LICENSE).
