import { __prod__ } from "./constants";
import { User } from "./entities/User";
import { createConnection } from "typeorm";

export default {
  synchronize: true,
  logging: true,
  entities: [User],
  dbName: "discordCloneDB",
  type: "postgres",
  debug: !__prod__,
  user: "dreadarceus",
  password: "123",
} as Parameters<typeof createConnection>[0];
