import DiscordJS from "discord.js";
import NameService from "../services/NameService";

class CommandController {
  message: DiscordJS.Message;
  nameService: NameService;
  args: string[];
  constructor(args: string[], message: DiscordJS.Message) {
    this.args = args;
    this.message = message;

    this.nameService = new NameService(message, args);
  }

  async handleProcess() {
    const command = this.args[0];
    switch (command) {
      case "add":
        if (!this.filterChannel(this.message.channelId, "971432862656122909"))
          return;
        await this.nameService.addName();
        console.log("add command");
        break;
      case "remove":
        if (!this.filterChannel(this.message.channelId, "971432862656122909"))
          return;
        await this.nameService.removeName();
        break;
      default:
        const reply = "There is no such command as !" + command;
        console.log(reply);
        this.message.reply({
          content: reply,
        });
        return;
    }
  }

  filterChannel(receivedChannelId: string, acceptedChannelId: string) {
    if (receivedChannelId !== acceptedChannelId) {
      return false;
    }
    return true;
  }
}
export default CommandController;
