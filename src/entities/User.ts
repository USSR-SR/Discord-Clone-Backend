import { UserServer } from "./UserServer";
import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { UserInteraction } from "./UserInteraction";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  username: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => UserServer, (userServer) => userServer.user)
  userServers: UserServer[];

  @OneToMany(() => UserInteraction, (userInteraction) => userInteraction.user1)
  primaryInteraction: UserInteraction[];

  @OneToMany(() => UserInteraction, (userInteraction) => userInteraction.user2)
  secondaryInteraction: UserInteraction[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
