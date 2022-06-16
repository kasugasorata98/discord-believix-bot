import { Message, TextChannel } from "discord.js";
import { Constants } from "../constants";
import DiscordClient from "../lib/DiscordClient";
import ProxyService from "../services/ProxyService";

class ProxyController extends DiscordClient {
  proxyService: ProxyService;
  constructor() {
    super();
    this.proxyService = new ProxyService();
  }

  async handleProxy(message: Message): Promise<void> {
    try {
      let channel: TextChannel;
      switch (message.channelId) {
        case Constants.CHANNEL_ID.GENERAL_PROXY:
          channel = this.getChannelByName(
            Constants.CHANNEL.GENERAL
          ) as TextChannel;
          break;
        default:
          return;
      }
      await this.proxyService.proxy(channel, message);
    } catch (err) {
      console.log(err);
    }
  }
}

export default ProxyController;
