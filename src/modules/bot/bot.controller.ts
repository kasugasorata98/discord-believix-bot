import DiscordJS, { Message, TextChannel } from "discord.js";
import ComplimentService from "../compliment/compliment.service";
import InsultService from "../insult/insult.service";
import CommandController from "../command/command.controller";
import WarCallController from "../war-call/war-call.controller";
import DiscordClient from "../../lib/DiscordClient";
import ItemShopController from "../item-shop/item-shop.controller";
import ProxyController from "../../dump/proxy/proxy.controller";
import TranslationController from "../translation/translation.controller";
import { Guild } from "../../models/Guild";
import { HydratedDocument } from "mongoose";

class BotController extends DiscordClient {
  insultService: InsultService;
  complimentService: ComplimentService;
  proxyController: ProxyController;
  translationController: TranslationController;
  guilds: HydratedDocument<Guild>[] = [];
  constructor() {
    super();
    this.insultService = new InsultService();
    this.complimentService = new ComplimentService();
    this.translationController = new TranslationController();
    this.proxyController = new ProxyController();
  }

  async init(): Promise<void> {
    await this.initializeDiscordClient();
    await this.initializeGuilds();
    // this.initializeWarCall(); disabled for now
    this.initializeItemShopController();
  }

  async initializeDiscordClient(): Promise<void> {
    this.getClient().on("messageCreate", (message) => {
      this.handleOnMessageCreated(message);
    });
    console.log('Discord Bot is logging in...')
    this.getClient().login(process.env.DISCORD_TOKEN);
    await new Promise<void>((resolve) => {
      this.getClient().on('ready', async () => {
        console.log('Discord Bot Logged in');
        resolve();
      })
    })
  }

  async initializeGuilds(): Promise<void> {
    this.guilds = await Guild.find().populate('functionalities').populate('channels');
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
    // console.log(message);
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
      this.handleFunctions(message);
    }
  }

  handleCommands(args: string[], message: DiscordJS.Message): void {
    const commandController = new CommandController(args, message);
    commandController.handleProcess();
  }

  handleFunctions(message: Message): void {

    this.translationController.processTranslation(message);

    this.complimentService.compliment(message);

    this.insultService.insult(message);

  }

}

export default BotController;
