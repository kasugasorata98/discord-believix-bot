import DiscordJS, { Intents, TextChannel } from "discord.js";

let discordClient: DiscordJS.Client<boolean>;

class DiscordClient {
  setClient() {
    console.log("Initializing Discord Bot");
    discordClient = new DiscordJS.Client({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
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
}
export default DiscordClient;
