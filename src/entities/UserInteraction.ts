import { FriendRequest } from "../types";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Message } from "./Message";
import { User } from "./User";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
@Entity()
export class UserInteraction extends BaseEntity {
  @ManyToOne(() => User, (user) => user.primaryInteraction, { primary: true })
  user1: User;

  @ManyToOne(() => User, (user) => user.secondaryInteraction, { primary: true })
  user2: User;

  @OneToMany(() => Message, (message) => message.direct)
  directMessages: Message[];

  @Field(() => String)
  @Column({ type: "text", default: "none" })
  friendRequest: FriendRequest;
}
