import { Entity, ManyToOne, Column } from "typeorm";
import { Message } from "../types";
import { User } from "./User";

@Entity()
export class Friend {
  @ManyToOne(() => User, (user) => user.friendsRecieved, { primary: true })
  recieverUser: User;

  @ManyToOne(() => User, (user) => user.friendsSupplied, { primary: true })
  supplierUser: User;

  @Column({ array: true, nullable: true, type: "json" })
  messages: Message[];
}
