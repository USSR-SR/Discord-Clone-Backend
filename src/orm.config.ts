import { __prod__ } from "./constants";
import { User } from "./entities/User";
import { createConnection } from "typeorm";
import { Server } from "./entities/Server";
import { UserServer } from "./entities/UserServer";
import { Friend } from "./entities/Friend";
import { Invite } from "./entities/Invite";

export default {
  synchronize: true,
  logging: true,
  entities: [User, Server, UserServer, Friend, Invite],
  dbName: "discordCloneDB",
  type: "postgres",
  debug: !__prod__,
  user: "dreadarceus",
  password: "123",
} as Parameters<typeof createConnection>[0];
