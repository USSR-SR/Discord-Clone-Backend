import { Field, ObjectType } from "type-graphql";
import { Entity, ManyToOne, Column, PrimaryColumn, BaseEntity } from "typeorm";
import { Server } from "./Server";

@ObjectType()
@Entity()
export class Invite extends BaseEntity {
  @Field()
  @PrimaryColumn()
  key: string;

  @ManyToOne(() => Server, (server) => server.invites)
  server: Server;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, type: "timestamp without time zone" })
  expirationDate: Date;
}
