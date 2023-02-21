import DiscordJS, { Intents, TextChannel } from "discord.js";

let discordClient: DiscordJS.Client<boolean>;

class DiscordClient {
  setClient() {
    console.log("Initializing Discord Bot");
    discordClient = new DiscordJS.Client({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.MESSAGE_CONTENT,
      ],
    });
  }

  getClient(): DiscordJS.Client<boolean> {
    if (!discordClient) {
      this.setClient();
    }
    return discordClient;
  }

  getChannelByName(channelName: string): TextChannel | null {
    const channels = discordClient.channels.cache;
    for (const channel of channels) {
      if ((channel[1] as TextChannel).name === channelName) {
        return discordClient.channels.cache.get(channel[0]) as TextChannel;
      }
    }
    return null;
  }

  getChannelById(channelId: string): TextChannel {
    return discordClient.channels.cache.get(channelId) as TextChannel;
  }

  async getChannelMessages(channelId: string): Promise<string[]> {
    const channel = this.getClient().channels.cache.get(
      channelId
    ) as TextChannel;
    let messages: string[] = [];
    let message = await channel.messages
      .fetch({ limit: 1 })
      .then((messagePage) =>
        messagePage.size === 1 ? messagePage.at(0) : null
      );
    while (message) {
      await channel.messages
        .fetch({ limit: 100, before: message.id })
        .then((messagePage) => {
          messagePage.forEach(async (msg) => {
            messages.push(msg.toString());
          });
          message =
            0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
        });
    }
    return messages;
  }
}
export default DiscordClient;
