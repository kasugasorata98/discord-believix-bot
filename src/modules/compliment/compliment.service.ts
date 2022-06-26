import { Util } from "../../utils/Util";
import DiscordJS from "discord.js";
import { Community } from "../../models/Community";
import AxiosClient from "../../lib/AxiosClient";

class ComplimentService {
  functionId: string;
  constructor() {
    this.functionId = '62b73f0d283607337e0d192e';
  }
  async compliment(message: DiscordJS.Message): Promise<void> {
    const community = await Community.find({
      isEnemy: false,
    });
    if (!community) return;

    const ally: string | boolean = Util.containsName(community, message.content);

    if (ally) {
      const name = `***${String(ally).toLowerCase()}***`;
      try {
        const res = await AxiosClient.get("https://complimentr.com/api");
        const data: { compliment: string } = res.data;
        await message.reply({
          content: `${name}, ${data.compliment}`,
        });
      } catch (err) {
        console.log(err);
      }
    }
  }
}
export default ComplimentService;
