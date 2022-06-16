import { TextChannel } from "discord.js";
import WarCallService from "./war-call.service";

class WarCallController {
  generalChannel: TextChannel;
  warCallService: WarCallService;
  constructor(generalChannel: TextChannel) {
    this.generalChannel = generalChannel;
    this.warCallService = new WarCallService(generalChannel);
  }

  handleProcess(): void {
    this.warCallService.startWarSuggestTimer();
  }
}

export default WarCallController;
