import { TextChannel, Role } from "../types";
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

@ObjectType()
@Entity()
export class Server extends BaseEntity {
  @Field()
  @PrimaryColumn()
  id: number;

  @BeforeInsert()
  private beforeInsert = () => {
    this.id = randomID();
  };

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  ownerID: number;

  @Field(() => [Role], { nullable: true })
  @Column({ array: true, type: "json", nullable: true })
  roles: Role[];

  @Field(() => [TextChannel])
  @Column({ array: false, type: "text" })
  textChannels: TextChannel[];

  @OneToMany(() => UserServer, (userServer) => userServer.server)
  userServers: UserServer[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
