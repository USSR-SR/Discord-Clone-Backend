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
import { Friend } from "./Friend";

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

  @OneToMany(() => Friend, (friend) => friend.recieverUser)
  friendsRecieved: Friend[];

  @OneToMany(() => Friend, (friend) => friend.supplierUser)
  friendsSupplied: Friend[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
