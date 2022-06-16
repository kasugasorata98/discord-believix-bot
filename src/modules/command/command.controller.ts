import DiscordJS, { TextChannel } from "discord.js";
import { Constants } from "../../constants";
import NameService from "../name/name.service";
import TimerService from "../timer/timer.service";

class CommandController {
  message: DiscordJS.Message;
  nameService: NameService;
  args: string[];
  timerService: TimerService;
  constructor(args: string[], message: DiscordJS.Message) {
    this.args = args;
    this.message = message;

    this.nameService = new NameService(message, args);
    this.timerService = new TimerService(message, args);
  }

  async handleProcess(): Promise<void> {
    const command = this.args[0];
    console.log(
      `Command: ${command} was called by ${this.message.author.username}`
    );
    switch (command) {
      case Constants.COMMAND.ADD:
        if (!this.filterChannel([Constants.CHANNEL.PERMA_SPAWN_LIST])) return;
        await this.nameService.addName();
        break;
      case Constants.COMMAND.REMOVE:
        if (!this.filterChannel([Constants.CHANNEL.PERMA_SPAWN_LIST])) return;
        await this.nameService.removeName();
        break;
      case Constants.COMMAND.LIST:
        await this.nameService.listNames();
        break;
      case Constants.COMMAND.TIMER:
        if (!this.filterChannel([Constants.CHANNEL.GENERAL])) return;
        await this.timerService.handleTimer();
        break;
      default:
        const reply = "There is no such command as !" + command;
        await this.message.reply({
          content: reply,
        });
        return;
    }
  }

  filterChannel(acceptedChannelIds: string[]): boolean {
    const messageChannel = (this.message.channel as TextChannel).name;
    if (messageChannel === Constants.CHANNEL.DEVELOPER) return true;
    return acceptedChannelIds.indexOf(messageChannel) > -1;
  }
}
export default CommandController;
