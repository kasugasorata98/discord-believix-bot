import { Message, TextChannel } from "discord.js";

class WarCallService {
  generalChannel: TextChannel;
  constructor(generalChannel: TextChannel) {
    this.generalChannel = generalChannel;
  }

  startWarSuggestTimer(ms = 1000 * 60 * 60 * 4) {
    setInterval(async () => {
      const sentMessage = await this.generalChannel.send({
        content:
          "Hey, @everyone. I believe it is time to gather up for war! Just a suggestion tho. Time to slay those nubs!\n\n React 🖐 if you are down to join.",
      });
      sentMessage.react("🖐");
    }, ms); // default 4 hours
  }
}

export default WarCallService;
