import { Server } from "../entities/Server";
import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { MyContext, RoleInput, TextChannelInput } from "../types";
import { UserServer } from "../entities/UserServer";
import { User } from "../entities/User";
import { getConnection } from "typeorm";
import { Invite } from "../entities/Invite";
import { Role } from "../entities/Role";
import { TextChannel } from "../entities/TextChannel";

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

    var newTextChannel = new TextChannel();
    newTextChannel.name = "general";
    newTextChannel.private = false;
    newTextChannel.server = newServer;
    await conn.manager.save(newTextChannel);

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

  @Query(() => [User])
  async getServerUsers(
    @Arg("serverID") serverID: string
  ): Promise<User[] | undefined> {
    const userServers = (
      await UserServer.find({ relations: ["user", "server"] })
    ).filter((item) => item.server.id === parseInt(serverID));
    const users = userServers.map((item) => item.user);
    return users;
  }

  @Query(() => [TextChannel], { nullable: true })
  async getServerTextChannels(
    @Arg("serverID") serverID: string
  ): Promise<TextChannel[] | undefined> {
    const server = await Server.findOne(serverID, {
      relations: ["textChannels"],
    });
    if (!server) return undefined;
    return server.textChannels;
  }

  @Mutation(() => TextChannel, { nullable: true })
  async createServerTextChannel(
    @Arg("options") options: TextChannelInput,
    @Arg("serverID") serverID: string
  ): Promise<TextChannel | undefined> {
    const conn = getConnection();
    const server = await Server.findOne(serverID);
    if (!server) return undefined;

    const newTextChannel = new TextChannel();
    newTextChannel.server = server;
    newTextChannel.name = options.name;
    newTextChannel.private = options.private;
    await conn.manager.save(newTextChannel);

    return newTextChannel;
  }

  @Query(() => [Role], { nullable: true })
  async getServerRoles(
    @Arg("serverID") serverID: string
  ): Promise<Role[] | undefined> {
    const server = await Server.findOne(serverID, { relations: ["roles"] });
    if (!server) return undefined;
    return server.roles;
  }

  @Mutation(() => Role, { nullable: true })
  async createServerRole(
    @Arg("options") options: RoleInput,
    @Arg("serverID") serverID: string
  ): Promise<Role | undefined> {
    const conn = getConnection();
    const server = await Server.findOne(serverID);
    if (!server) return undefined;

    const newRole = new Role();
    newRole.server = server;
    newRole.name = options.name;
    newRole.color = options.color;
    newRole.displaySeparate = options.displaySeparate;
    newRole.admin = options.admin;
    await conn.manager.save(newRole);

    return newRole;
  }

  @Query(() => [Server])
  async devAllServers(): Promise<Server[]> {
    const servers = await Server.find({});
    const relServers = await Server.find({
      relations: ["userServers", "roles", "textChannels", "invites"],
    });
    console.log(relServers[0]);
    return servers;
  }

  @Mutation(() => Server, { nullable: true })
  async devServerDelete(): Promise<void> {
    Invite.delete({});
    UserServer.delete({});
    Server.delete({});
  }
}
