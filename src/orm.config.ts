import { __prod__ } from "./constants";
import { User } from "./entities/User";
import { createConnection } from "typeorm";
import { Server } from "./entities/Server";
import { UserServer } from "./entities/UserServer";
import { UserInteraction } from "./entities/UserInteraction";
import { Invite } from "./entities/Invite";
import { TextChannel } from "./entities/TextChannel";
import { Message } from "./entities/Message";
import { Role } from "./entities/Role";

export default {
  synchronize: true,
  logging: true,
  entities: [
    User,
    Server,
    UserServer,
    UserInteraction,
    Invite,
    TextChannel,
    Message,
    Role,
  ],
  dbName: "discordCloneDB",
  type: "postgres",
  debug: !__prod__,
  user: "dreadarceus",
  password: "123",
} as Parameters<typeof createConnection>[0];
