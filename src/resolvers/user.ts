import { User } from "../entities/User";
import { MyContext } from "../types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import argon2 from "argon2";
import { Server } from "../entities/Server";
import { UserServer } from "../entities/UserServer";
import { parseServerJSON } from "../utils/parsers";

@InputType()
class UsernamePasswordInput {
  @Field()
  usernameOrEmail: string;
  @Field()
  password: string;
}

@InputType()
class RegisterInput {
  @Field()
  username: string;
  @Field()
  email: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext): Promise<User | undefined> {
    if (!req.session.userID) {
      return undefined;
    }
    return User.findOne(req.session.userID);
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: RegisterInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const hashedPassword = await argon2.hash(options.password);
    let user;
    try {
      user = await User.create({
        username: options.username,
        email: options.email,
        password: hashedPassword,
      }).save();
    } catch (err) {
      if (err.code === "23505") {
        let errorField;
        if (err.detail.includes("email")) {
          errorField = "email";
        } else {
          errorField = "username";
        }
        return {
          errors: [
            {
              field: errorField,
              message: `user with this ${errorField} already exists`,
            },
          ],
        };
      }
    }

    req.session!.userID = user?.id;

    return { user: user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    let choice;
    if (options.usernameOrEmail.includes(".com")) {
      choice = "email";
    } else {
      choice = "username";
    }
    const user = await User.findOne({
      where:
        choice == "username"
          ? { username: options.usernameOrEmail }
          : { email: options.usernameOrEmail },
    });
    if (!user) {
      return {
        errors: [
          {
            field: choice,
            message: `user with this ${choice} not found`,
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, options.password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    req.session!.userID = user.id;

    return { user: user };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req }: MyContext): Promise<Boolean> {
    if (!req.session.userID) {
      return false;
    }
    req.session.userID = undefined;
    return true;
  }

  @Query(() => [Server])
  async getUserServers(
    @Ctx() { req }: MyContext
  ): Promise<Server[] | undefined> {
    const { userID } = req.session;
    const userServers = (
      await UserServer.find({ relations: ["user", "server"] })
    ).filter((item) => item.user.id === userID);
    const servers = parseServerJSON(userServers.map((item) => item.server));
    return servers;
  }

  @Query(() => [User])
  async devAllUsers(): Promise<User[]> {
    return User.find();
  }

  @Mutation(() => User, { nullable: true })
  async devDeleteUsers(): Promise<void> {
    User.delete({});
  }
}
