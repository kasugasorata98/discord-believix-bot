import axios from "axios";
import DiscordJS from "discord.js";
import { Insult } from "../entities/InsultResponse";
import { Name } from "../models/Name";
import { Util } from "../utils/Util";

class InsultService {
  async insult(message: DiscordJS.Message) {
    const names = await Name.find({
      isEnemy: true,
    });
    if (!names) return;

    let enemy: string | boolean = Util.containsName(names, message.content);

    if (enemy) {
      try {
        enemy = `***${String(enemy).toLowerCase()}***`;
        const res = await axios.get(
          `https://insult.mattbas.org/api/en/insult.json?who=${enemy}`
        );
        const data: Insult = res.data;
        message.reply({
          content: data.insult,
        });
      } catch (err) {
        console.log(err);
      }
    }
  }
}

export default InsultService;
