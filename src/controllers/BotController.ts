import DiscordJS from "discord.js";
import BaseController from "./BaseController";
import CommandController from "./CommandController";

class BotController extends BaseController {
  constructor() {
    super();
  }

  init() {
    this.discordClient.on("ready", () => {
      console.log(`Logged in as ${this.discordClient.user?.tag}!`);
    });
    this.discordClient.on("messageCreate", (message) => {
      this.handleOnMessageCreated(message);
    });

    this.discordClient.login(process.env.TOKEN);
  }

  handleOnMessageCreated(message: DiscordJS.Message) {
    if (message.author.bot === true) {
      return;
    }
    if (message.content.startsWith("!")) {
      const args = message.content.slice(1).split(/ +/); //removes ! and split into array
      this.handleCommands(args, message);
    } else {
      this.complimentService.compliment(message);
      this.insultService.insult(message);
    }
  }

  handleCommands(args: string[], message: DiscordJS.Message) {
    const commandController = new CommandController(args, message);
    commandController.handleProcess();
  }
}

export default BotController;
