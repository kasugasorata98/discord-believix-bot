import { Message, TextChannel } from "discord.js";
import DiscordClient from "../../lib/DiscordClient";

class ProxyService extends DiscordClient {
  constructor() {
    super();
  }
  async proxy(channel: TextChannel, message: Message): Promise<void> {
    await channel.send({
      content: message.content,
    });
    await message.delete();
  }
}

export default ProxyService;
