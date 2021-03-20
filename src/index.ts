import "reflect-metadata";
import { createConnection } from "typeorm";
import { __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import ormConfig from "./orm.config";
import { MyContext } from "./types";
import { UserResolver } from "./resolvers/user";
import { ServerResolver } from "./resolvers/server";
import { InviteResolver } from "./resolvers/invite";

declare module "express-session" {
  export interface SessionData {
    userID: number;
  }
}

const main = async () => {
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  const conn = await createConnection(ormConfig);
  conn.runMigrations();

  const app = express();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  app.use(
    session({
      name: "qid",
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
        httpOnly: true, //make cookie not accessible to front end
        sameSite: "lax", //csrf protection(?)
        secure: __prod__, //cookie works only in https
      },
      secret: "somesecretbro",
      resave: false,
      saveUninitialized: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, ServerResolver, InviteResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ req, res }),
  });
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("server started on port 4000");
  });
};

main().catch((err) => {
  console.error(err);
});
