import { Request, Response } from "express";
import { InputType, Field } from "type-graphql";

export type MyContext = {
  req: Request;
  res: Response;
};

export type FriendRequest = "none" | "sentByUser1" | "sentByUser2" | "accepted";

@InputType()
export class UsernamePasswordInput {
  @Field()
  usernameOrEmail: string;
  @Field()
  password: string;
}

@InputType()
export class RegisterInput {
  @Field()
  username: string;
  @Field()
  email: string;
  @Field()
  password: string;
}

@InputType()
export class RoleInput {
  @Field()
  name: string;
  @Field()
  color: string;
  @Field()
  admin: boolean;
  @Field()
  displaySeparate: boolean;
}

@InputType()
export class TextChannelInput {
  @Field()
  name: string;
  @Field()
  private: boolean;
}
