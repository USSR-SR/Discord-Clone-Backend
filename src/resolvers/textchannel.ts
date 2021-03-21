import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { MyContext } from "../types";
import { getConnection } from "typeorm";
import { TextChannel } from "../entities/TextChannel";
import { Message } from "../entities/Message";

@Resolver()
export class TextChannelResolver {
  @Query(() => [Message], { nullable: true })
  async getTextChannelMessages(
    @Arg("textChannelID") textChannelID: string
  ): Promise<Message[] | undefined> {
    const textChannel = await TextChannel.findOne(textChannelID, {
      relations: ["messages"],
    });
    if (!textChannel) return undefined;
    return textChannel.messages;
  }

  @Mutation(() => Message, { nullable: true })
  async createTextChannelMessage(
    @Arg("textChannelID") textChannelID: string,
    @Arg("text") text: string,
    @Ctx() { req }: MyContext
  ): Promise<Message | undefined> {
    const conn = getConnection();
    const textChannel = await TextChannel.findOne(textChannelID);
    if (!textChannel || !req.session.userID) return undefined;

    const newMessage = new Message();
    newMessage.textChannel = textChannel;
    newMessage.authorID = req.session.userID;
    newMessage.text = text;
    await conn.manager.save(newMessage);

    return newMessage;
  }

  @Query(() => [TextChannel])
  async devAllTextChannels(): Promise<TextChannel[]> {
    const textChannels = await TextChannel.find({});
    const relTextChannels = await TextChannel.find({
      relations: ["messages"],
    });
    console.log(relTextChannels[0]);
    return textChannels;
  }
}
