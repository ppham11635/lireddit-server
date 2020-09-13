import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import mikroConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { Post } from './entites/Post';
const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  const post = orm.em.create(Post, { title: 'my second post' });
  await orm.em.persistAndFlush(post);
  await orm.getMigrator().up();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }),
  });

  apolloServer.applyMiddleware({ app });
  app.listen(4000, () => {
    console.log('server started on locathost: 4000');
  });
};

main().catch((err) => {
  console.error(err);
});
