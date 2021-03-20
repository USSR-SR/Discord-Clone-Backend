import { Request, Response } from "express";
import { Field, ObjectType } from "type-graphql";

export type MyContext = {
  req: Request;
  res: Response;
};

@ObjectType()
export class Role {
  @Field()
  name: string;

  @Field()
  admin: boolean;

  @Field()
  color: string;

  @Field()
  displaySeparate: boolean;
}

@ObjectType()
export class TextChannel {
  @Field()
  name: string;

  @Field()
  private: boolean;

  @Field(() => [Message], { nullable: true })
  messages?: Message[];

  @Field(() => [Message], { nullable: true })
  pins?: Message[];
}

@ObjectType()
export class Message {
  @Field()
  authorID: number;

  @Field()
  createdAt: Date;

  @Field()
  text: string;
}
