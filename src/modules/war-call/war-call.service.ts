import { TextChannel } from "discord.js";

class WarCallService {
  generalChannel: TextChannel;
  constructor(generalChannel: TextChannel) {
    this.generalChannel = generalChannel;
  }

  startWarSuggestTimer(ms = 1000 * 60 * 60 * 4): void {
    setInterval(async () => {
      const sentMessage = await this.generalChannel.send({
        content:
          "Hey, @everyone. I believe it is time to gather up for war! Just a suggestion tho. Time to slay those nubs!\n\n React 🖐 if you are down to join.",
      });
      sentMessage.react("🖐");
      console.log("War Suggestion has been sent");
    }, ms); // default 4 hours
    console.log(
      `War Suggestion Timer Initialized. Interval of ${ms} milliseconds`
    );
  }
}

export default WarCallService;
