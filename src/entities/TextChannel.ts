import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  Column,
  BeforeInsert,
  ManyToOne,
  PrimaryColumn,
  OneToMany,
  BaseEntity,
} from "typeorm";
import { randomID } from "../utils/randomID";
import { Message } from "./Message";
import { Server } from "./Server";

@ObjectType()
@Entity()
export class TextChannel extends BaseEntity {
  @Field()
  @PrimaryColumn()
  id: number;

  @BeforeInsert()
  protected beforeInsert = () => {
    this.id = randomID();
  };

  @ManyToOne(() => Server, (server) => server.textChannels)
  server: Server;

  @OneToMany(() => Message, (message) => message.textChannel)
  messages: Message[];

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  private: boolean;

  // @Field(() => [Message], { nullable: true })
  // @Column()
  // pins?: Message[];
}
