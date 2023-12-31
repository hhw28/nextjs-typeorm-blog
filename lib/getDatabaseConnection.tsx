import { createConnection, getConnectionManager } from "typeorm";
import "reflect-metadata";
import { Post } from "src/entity/Post";
import { User } from "src/entity/User";
import { Comment } from "src/entity/Comment";
import config from "ormconfig.json";

const create = function () {
  // @ts-ignore
  return createConnection({
    ...config,
    database: process.env.NODE_ENV === 'production' ? 'blog_production' : 'blog_development',
    entities: [Post, User, Comment],
  });
};

const promise = (async function () {
  const manager = getConnectionManager();

  const current = manager.has("default") && manager.get("default");
  if (current && current.isConnected) {
    await current.close();
  }

  return create();
})();

export const getDatabaseConnection = function () {
  return promise;
};
