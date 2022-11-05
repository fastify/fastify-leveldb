import fastify from 'fastify';
import fastifyLeveldb from '../fastify-leveldb';

const app = fastify();

app
  .register(fastifyLeveldb, {
    name: 'test',
    path: '.local'
  })
  .after(async (err) => {
    const dbTest = app.level.test;
    await dbTest.put("sample", "value");
    await dbTest.get("sample");
  });
