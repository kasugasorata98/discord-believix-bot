import { Collection, Message, Snowflake, TextChannel } from "discord.js";
import Readline from 'readline';

export const Util = {
  escapeRegExp: (string: string): string => {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  },
  sleep: (delay: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, delay);
    });
  },
  containsName: (arr: any[], message: string): boolean | string => {
    for (const community of arr) {
      var regex = "\\b";
      regex += Util.escapeRegExp(community.name);
      regex += "\\b";
      const found = new RegExp(regex, "i").test(message);
      if (found) {
        return community.name;
      }
    }
    return false;
  },
  uncapitalizeFirstLetter: (string: string): string => {
    return string.charAt(0).toLowerCase() + string.slice(1);
  },
  minutesToMilliseconds: (number: number): number => {
    return 1000 * 60 * number;
  },
  hoursToMilliseconds: (number: number): number => {
    return 1000 * 60 * 60 * number;
  },
  getRemainingTime: (delay: number, startTimeMS: number) => {
    return delay - (new Date().getTime() - startTimeMS);
  },
  millisToMinutesAndSeconds: (millis: number): string => {
    let minutes = Math.floor(millis / 60000);
    let seconds = Number(((millis % 60000) / 1000).toFixed(0));
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  },
  clearChannelMessages: async (channel: TextChannel) => {
    const deleteMessages = async (): Promise<
      Collection<Snowflake, Message>
    > => {
      return await channel.bulkDelete(100);
    };
    if (channel) {
      let deleted: Collection<Snowflake, Message>;
      do {
        try {
          deleted = await deleteMessages();
        } catch (err) {
          deleted = await deleteMessages();
        }
      } while (deleted.size !== 0);
    }
  },
  askQuestion: (question: string): Promise<string> => {
    return new Promise((resolve) => {
      const readline = Readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      readline.question(question, reply => {
        readline.close();
        resolve(reply);
      })
    })
  },
};
