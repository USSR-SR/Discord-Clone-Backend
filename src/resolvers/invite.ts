import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { Server } from "../entities/Server";
import { Invite } from "../entities/Invite";
import { generateInviteKey } from "../utils/generateInviteKey";
import { parseServerJSON } from "../utils/parsers";
import { UserServer } from "../entities/UserServer";
import { User } from "../entities/User";
import { MyContext } from "../types";

@Resolver()
export class InviteResolver {
  @Mutation(() => Invite, { nullable: true })
  async createInvite(
    @Arg("serverID") serverID: string,
    @Arg("expirationDate", { nullable: true }) expirationDate: Date
  ): Promise<Invite | undefined> {
    const conn = getConnection();
    const server = await Server.findOne(serverID);
    if (!server) return undefined;

    const newInvite = new Invite();
    newInvite.key = generateInviteKey();
    newInvite.server = parseServerJSON([server])[0];
    newInvite.expirationDate = expirationDate;
    await conn.manager.save(newInvite);

    return newInvite;
  }

  @Mutation(() => Server, { nullable: true })
  async acceptInvite(
    @Ctx() { req }: MyContext,
    @Arg("inviteKey") inviteKey: string
  ): Promise<Server | undefined> {
    const conn = getConnection();
    const invite = await Invite.findOne({
      where: { key: inviteKey },
      relations: ["server"],
    });
    const user = await User.findOne(req.session.userID);
    if (!invite || !user) return undefined;

    if (invite.expirationDate && invite.expirationDate < new Date()) {
      return undefined;
    }

    const newRelation = new UserServer();
    newRelation.server = invite.server;
    newRelation.user = user;
    await conn.manager.save(newRelation);

    return invite.server;
  }

  @Query(() => [Invite])
  async devAllInvites(): Promise<Invite[] | void> {
    const invites = await Invite.find({ relations: ["server"] });
    console.log(invites);
    return Invite.find();
  }
}
