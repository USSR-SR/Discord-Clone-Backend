import { ObjectType, Field } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Server } from "./Server";

@ObjectType()
@Entity()
export class Role extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Server, (server) => server.roles)
  server: Server;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  admin: boolean;

  @Field()
  @Column({ nullable: true })
  color: string;

  @Field()
  @Column()
  displaySeparate: boolean;
}
