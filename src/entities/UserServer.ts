import { Entity, ManyToOne, Column, BaseEntity } from "typeorm";
import { User } from "./User";
import { Server } from "./Server";

@Entity()
export class UserServer extends BaseEntity {
  @ManyToOne(() => User, (user) => user.userServers, { primary: true })
  user: User;

  @ManyToOne(() => Server, (server) => server.userServers, { primary: true })
  server: Server;

  @Column({ nullable: true })
  nickname: string;

  @Column({ array: true, nullable: true, type: "json" })
  roles: string[];
}
