import DiscordJS, { TextChannel } from "discord.js";
import ComplimentService from "../services/ComplimentService";
import InsultService from "../services/InsultService";
import CommandController from "./CommandController";
import WarCallController from "./WarCallController";
import DiscordClient from "../lib/DiscordClient";

class BotController extends DiscordClient {
  insultService: any;
  complimentService: any;
  constructor() {
    super();
    this.insultService = new InsultService();
    this.complimentService = new ComplimentService();
  }

  init() {
    this.getClient().on("ready", async (client) => {
      console.log(`Logged in as ${client.user?.tag}!`);
      this.initializeWarCall();
    });
    this.getClient().on("messageCreate", (message) => {
      this.handleOnMessageCreated(message);
    });
    this.getClient().login(process.env.TOKEN);
  }

  initializeWarCall() {
    const generalChannel: TextChannel | null = this.getChannelByName("general");
    if (generalChannel) {
      const warCallController = new WarCallController(generalChannel);
      warCallController.handleProcess();
    }
  }

  async handleOnMessageCreated(message: DiscordJS.Message) {
    if (message.author.bot === true) {
      return;
    }
    if (message.content.includes("<@982060525267603494>"))
      // tagging the bot response
      return await message.reply({
        content: "Wtf do you want from me 🤬?",
      });
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
