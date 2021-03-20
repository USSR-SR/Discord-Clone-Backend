import { Server } from "../entities/Server";
import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { MyContext } from "../types";
import { UserServer } from "../entities/UserServer";
import { User } from "../entities/User";
import { getConnection } from "typeorm";
import { parseServerJSON } from "../utils/parsers";
import { Invite } from "../entities/Invite";

@Resolver()
export class ServerResolver {
  @Mutation(() => Server, { nullable: true })
  async createServer(
    @Ctx() { req }: MyContext,
    @Arg("name") name: string
  ): Promise<Server | undefined> {
    if (!req.session.userID) {
      return undefined;
    }
    const conn = getConnection();

    const newServer = Server.create({
      name: name,
      ownerID: req.session.userID,
      textChannels: [{ name: "general", private: true }],
    });
    await newServer.save();

    const owner = await User.findOne(req.session.userID);
    if (!owner) {
      return undefined;
    }

    const newRelation = new UserServer();
    newRelation.server = newServer;
    newRelation.user = owner;
    await conn.manager.save(newRelation);

    return newServer;
  }

  @Query(() => [Invite], { nullable: true })
  async getServerInvites(
    @Arg("serverID") serverID: string
  ): Promise<Invite[] | undefined> {
    const server = await Server.findOne({
      where: { id: serverID },
      relations: ["invites"],
    });
    if (!server) return undefined;
    return server.invites;
  }

  @Query(() => [Server])
  async devAllServers(): Promise<Server[]> {
    const servers = parseServerJSON(await Server.find({}));
    return servers;
  }

  @Mutation(() => Server, { nullable: true })
  async devServerDelete(): Promise<void> {
    Invite.delete({});
    UserServer.delete({});
    Server.delete({});
  }
}
