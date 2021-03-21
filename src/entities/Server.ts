import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
  PrimaryColumn,
  BeforeInsert,
} from "typeorm";
import { UserServer } from "./UserServer";
import { randomID } from "../utils/randomID";
import { Invite } from "./Invite";
import { Role } from "./Role";
import { TextChannel } from "./TextChannel";

@ObjectType()
@Entity()
export class Server extends BaseEntity {
  @Field()
  @PrimaryColumn()
  id: number;

  @BeforeInsert()
  protected beforeInsert = () => {
    this.id = randomID();
  };

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  ownerID: number;

  @OneToMany(() => Role, (role) => role.server)
  roles: Role[];

  @OneToMany(() => TextChannel, (textChannel) => textChannel.server)
  textChannels: TextChannel[];

  @OneToMany(() => UserServer, (userServer) => userServer.server)
  userServers: UserServer[];

  @OneToMany(() => Invite, (invite) => invite.server)
  invites: Invite[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
