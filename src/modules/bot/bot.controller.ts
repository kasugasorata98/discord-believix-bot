import DiscordJS, { Message } from "discord.js";
import CommandController from "../command/command.controller";
import DiscordClient from "../../lib/DiscordClient";
import { config } from "../../config";
import OpenAIController from "../openai/openAi.controller";
import axios from "axios";

class BotController extends DiscordClient {
  openAI: OpenAIController;
  constructor() {
    super();
    this.openAI = new OpenAIController();
  }

  async init(): Promise<void> {
    await this.initializeDiscordClient();
  }

  async initializeDiscordClient(): Promise<void> {
    this.getClient().on("messageCreate", (message) => {
      this.handleOnMessageCreated(message);
    });
    console.log("Discord Bot is logging in...");
    this.getClient().login(config.discordToken);
    await new Promise<void>((resolve) => {
      this.getClient().on("ready", async () => {
        console.log("Discord Bot Logged in");
        resolve();
      });
    });
  }

  async handleOnMessageCreated(
    message: DiscordJS.Message
  ): Promise<Message | void> {
    // console.log(message);
    if (message.author.bot === true) {
      return;
    }
    if (message.content.includes("<@982060525267603494>")) {
      try {
        const response = await this.openAI.chat(message.content);
        message.reply(response);
      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          message.reply(
            "```" + JSON.stringify(err?.response?.data, null, 2) + "```"
          );
        } else {
          console.log(err);
        }
      }
    }

    if (message.content.startsWith("!")) {
      const args = message.content.slice(1).split(/ +/); //removes ! and split into array
      this.handleCommands(args, message);
    }
  }

  handleCommands(args: string[], message: DiscordJS.Message): void {
    const commandController = new CommandController(args, message);
    commandController.handleProcess();
  }
}

export default BotController;
