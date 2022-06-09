import { Util } from "../utils/Util";
import axios from "axios";
import DiscordJS from "discord.js";
import { Name } from "../models/Name";

class ComplimentService {
  async compliment(message: DiscordJS.Message): Promise<void> {
    const names = await Name.find({
      isEnemy: false,
    });
    if (!names) return;

    const ally: string | boolean = Util.containsName(names, message.content);

    if (ally) {
      const name = `***${String(ally).toLowerCase()}***`;
      try {
        const res = await axios.get("https://complimentr.com/api");
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
