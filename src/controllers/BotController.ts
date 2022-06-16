import DiscordJS, { Message, TextChannel } from "discord.js";
import ComplimentService from "../services/ComplimentService";
import InsultService from "../services/InsultService";
import CommandController from "./CommandController";
import WarCallController from "./WarCallController";
import DiscordClient from "../lib/DiscordClient";
import TranslationService from "../services/TranslationService";
import ItemShopController from "./ItemShopController";
import ProxyController from "./ProxyController";

class BotController extends DiscordClient {
  insultService: any;
  complimentService: any;
  translationService: TranslationService;
  proxyController: ProxyController;
  constructor() {
    super();
    this.insultService = new InsultService();
    this.complimentService = new ComplimentService();
    this.translationService = new TranslationService();
    this.proxyController = new ProxyController();
  }

  init(): void {
    this.getClient().on("ready", (client) => {
      console.log(`Logged in as ${client.user?.tag}!`);
      this.initializeWarCall();
      this.initializeItemShopController();
    });
    this.getClient().on("messageCreate", (message) => {
      console.log(`${message.author.username}: ${message.content}`);
      this.handleOnMessageCreated(message);
    });
    this.getClient().login(process.env.DISCORD_TOKEN);
  }

  initializeWarCall(): void {
    console.log("Initializing War Call");
    const generalChannel: TextChannel | null = this.getChannelByName("general");
    if (generalChannel) {
      const warCallController = new WarCallController(generalChannel);
      warCallController.handleProcess();
    }
  }

  initializeItemShopController(): void {
    const itemShopController = new ItemShopController();
    itemShopController.scheduleScrappingForNA();
    itemShopController.scheduleScrappingForDE();
  }

  async handleOnMessageCreated(
    message: DiscordJS.Message
  ): Promise<Message | void> {
    if (message.author.bot === true) {
      return;
    }
    if (message.content.includes("<@982060525267603494>")) {
      console.log("Someone tagged the bot");
      // tagging the bot response
      return await message.reply({
        content: "Wtf do you want from me 🤬?",
      });
    }
    if (message.content.startsWith("!")) {
      const args = message.content.slice(1).split(/ +/); //removes ! and split into array
      this.handleCommands(args, message);
    } else {
      this.translationService.processMessage(message);
      this.complimentService.compliment(message);
      this.insultService.insult(message);
      this.proxyController.handleProxy(message);
    }
  }

  handleCommands(args: string[], message: DiscordJS.Message): void {
    const commandController = new CommandController(args, message);
    commandController.handleProcess();
  }
}

export default BotController;
