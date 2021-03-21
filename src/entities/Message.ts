import { randomID } from "../utils/randomID";
import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  PrimaryColumn,
  BeforeInsert,
  Column,
  CreateDateColumn,
  ManyToOne,
  BaseEntity,
} from "typeorm";
import { TextChannel } from "./TextChannel";
import { UserInteraction } from "./UserInteraction";

@ObjectType()
@Entity()
export class Message extends BaseEntity {
  @Field()
  @PrimaryColumn()
  id: number;

  @BeforeInsert()
  protected beforeInsert = () => {
    this.id = randomID();
  };

  @ManyToOne(() => TextChannel, (textChannel) => textChannel.messages)
  textChannel: TextChannel;

  @ManyToOne(
    () => UserInteraction,
    (userInteraction) => userInteraction.directMessages
  )
  direct: UserInteraction;

  @Field()
  @Column()
  authorID: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @Column()
  text: string;
}
