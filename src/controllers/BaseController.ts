import DiscordJS, { Intents } from "discord.js";
import ComplimentService from "../services/ComplimentService";
import InsultService from "../services/InsultService";
class BaseController {
  discordClient: DiscordJS.Client;
  insultService: InsultService;
  complimentService: ComplimentService;
  constructor() {
    this.discordClient = new DiscordJS.Client({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    });
    this.insultService = new InsultService();
    this.complimentService = new ComplimentService();
  }
}

export default BaseController;
