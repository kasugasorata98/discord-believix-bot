import { TextChannel } from "discord.js";
import WarCallService from "../services/WarCallService";

class WarCallController {
  generalChannel: TextChannel;
  warCallService: WarCallService;
  constructor(generalChannel: TextChannel) {
    this.generalChannel = generalChannel;
    this.warCallService = new WarCallService(generalChannel);
  }

  handleProcess() {
    this.warCallService.startWarSuggestTimer();
  }
}

export default WarCallController;
