import { Message } from "discord.js";
import { Constants } from "../constants";
import DiscordClient from "../lib/DiscordClient";
import { Util } from "../utils/Util";

let timer: string | number | NodeJS.Timeout | null | undefined = null;
let startTimeMS = 0;
let delay = 0;
class TimerService {
  message: Message;
  args: string[];
  discordClient: DiscordClient;
  constructor(message: Message, args: string[]) {
    this.message = message;
    this.args = args;
    this.discordClient = new DiscordClient();
  }
  async handleTimer(): Promise<void> {
    switch (this.args[1]) {
      case "set":
        this.setTimer();
        break;
      case "get":
        this.getTimer();
        break;
      case "remove":
        this.clearTimer();
        await this.message.reply({
          content: "Timer has been removed",
        });
        break;
      default:
        await this.message.reply({
          content: "Invalid second argument, only accepting set/get/remove",
        });
    }
  }
  async getTimer(): Promise<Message> {
    if (timer) {
      const remaining = Util.millisToMinutesAndSeconds(
        Util.getRemainingTime(delay, startTimeMS)
      );
      const split = remaining.split(":");

      return this.message.reply({
        content: `Time remaining: ${split[0]} minute(s) ${split[1]} second(s)`,
      });
    }
    return this.message.reply({
      content: `No timer has been set.`,
    });
  }
  async setTimer(): Promise<Message | void> {
    /*
        args[1] = number (probably minutes or hours)
        args[2] = either min/mins/minute/minutes or hr/hrs/hour/hours
    */
    try {
      if (!this.args[3]) {
        return await this.message.reply({
          content:
            "Third argument must not be empty, it has to be either min/mins/minute/minutes or hr/hrs/hour/hours.",
        });
      }
      const number = Number(this.args[2]);
      const type = this.args[3];
      let isMinute = false;
      switch (type) {
        case "min":
        case "mins":
        case "minute":
        case "minutes":
          isMinute = true;
          break;
        case "hr":
        case "hrs":
        case "hour":
        case "hours":
          isMinute = false;
          break;
        default:
          return await this.message.reply({
            content:
              "Invalid 3rd argument, it has to be either min/mins/minute/minutes or hr/hrs/hour/hours.",
          });
      }
      this.clearTimer();
      delay = isMinute
        ? Util.minutesToMilliseconds(number)
        : Util.hoursToMilliseconds(number);
      timer = setTimeout(async () => {
        const generalChannel = this.discordClient.getChannelByName(
          Constants.CHANNEL.GENERAL
        );
        const sentMessage = await generalChannel?.send({
          content:
            "@everyone! Timer is up, their charms are gone! Lets head back in 🤡\n React to 🖐 if you are down to join.",
        });
        await sentMessage?.react("🖐");
      }, delay);
      startTimeMS = new Date().getTime();
      await this.message.reply({
        content: "Timer has been set.",
      });
    } catch (err: any) {
      console.log(err.code, err.message);
      return await this.message.reply({
        content: err.message,
      });
    }
  }

  clearTimer(): void {
    if (timer) {
      clearTimeout(timer);
      startTimeMS = 0;
      delay = 0;
      timer = null;
    }
  }
}

export default TimerService;
