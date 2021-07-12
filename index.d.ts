import { FastifyPlugin } from "fastify";
import { LevelUp } from "levelup";

export interface LevelDBOptions {
  name: string,
  path: string
}

type LevelDBInstances {
  [key: string]: LevelUp
}

// Most importantly, use declaration merging to add the custom property to the Fastify type system
declare module 'fastify' {
  interface FastifyInstance {
    level: LevelDBInstances
  }
}

// fastify-plugin automatically adds named export, so be sure to add also this type
// the variable name is derived from `options.name` property if `module.exports.myPlugin` is missing
export const levelDBPlugin: FastifyPlugin<LevelDBOptions>;

// fastify-plugin automatically adds `.default` property to the exported plugin. See the note below
export default levelDBPlugin;
