import DiscordJS, { Message, TextChannel } from "discord.js";
import ComplimentService from "../compliment/compliment.service";
import InsultService from "../insult/insult.service";
import CommandController from "../command/command.controller";
import WarCallController from "../war-call/war-call.controller";
import DiscordClient from "../../lib/DiscordClient";
import ItemShopController from "../item-shop/item-shop.controller";
import ProxyController from "../proxy/proxy.controller";
import TranslationController from "../translation/translation.controller";

class BotController extends DiscordClient {
  insultService: any;
  complimentService: any;

  proxyController: ProxyController;
  translationController: TranslationController;
  constructor() {
    super();
    this.insultService = new InsultService();
    this.complimentService = new ComplimentService();
    this.translationController = new TranslationController();
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
      // tagging the bot response
      return await message.reply({
        content: "Wtf do you want from me 🤬?",
      });
    }
    if (message.content.startsWith("!")) {
      const args = message.content.slice(1).split(/ +/); //removes ! and split into array
      this.handleCommands(args, message);
    } else {
      this.translationController.processTranslation(message);
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
