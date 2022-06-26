import axios from "axios";
import DiscordJS from "discord.js";
import { Community } from "../../models/Community";
import { Util } from "../../utils/Util";
import { getRandom } from "random-useragent";

class InsultService {
  functionId: string;
  constructor() {
    this.functionId = '62b73f0b283607337e0d192c';
  }
  async insult(message: DiscordJS.Message): Promise<void> {
    const community = await Community.find({
      isEnemy: true,
    });
    if (!community) return;

    let enemy: string | boolean = Util.containsName(community, message.content);

    if (enemy) {
      try {
        enemy = `***${String(enemy).toLowerCase()}***`;
        const axiosInstance = axios.create({
          headers: {
            "User-Agent": getRandom(),
          },
        });
        let reply = "";
        switch (Math.floor(Math.random() * 4)) {
          case 0: {
            const res = await axiosInstance.get(
              `https://insult.mattbas.org/api/en/insult.json?who=${enemy}`
            );
            reply = res.data.insult;
            break;
          }
          case 1: {
            const res = await axiosInstance.get(
              `https://evilinsult.com/generate_insult.php?lang=${Math.random() * 2 === 0 ? "en" : "es"
              }`
            );
            reply = `${enemy} ${Util.uncapitalizeFirstLetter(res.data)}`;
            break;
          }
          case 2: {
            const res = await axiosInstance.get(
              "https://insults.tr00st.co.uk/your_mom/"
            );
            reply = `${enemy} ${Util.uncapitalizeFirstLetter(res.data)}`;
            break;
          }
          case 3: {
            const res = await axiosInstance.get(
              `https://trumpinsultgenerator.com/api/InsultGenerator?subject=${enemy}`
            );
            reply = res.data.insult;
            break;
          }
        }
        await message.reply({
          content: reply,
        });
      } catch (err) {
        console.log(err);
      }
    }
  }
}

export default InsultService;
