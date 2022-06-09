import axios from "axios";
import DiscordJS from "discord.js";
import { Insult } from "../entities/InsultResponse";
import { Name } from "../models/Name";
import { Util } from "../utils/Util";

class InsultService {
  async insult(message: DiscordJS.Message): Promise<void> {
    const names = await Name.find({
      isEnemy: true,
    });
    if (!names) return;

    let enemy: string | boolean = Util.containsName(names, message.content);

    if (enemy) {
      try {
        enemy = `***${String(enemy).toLowerCase()}***`;
        const axiosInstance = axios.create({
          headers: {
            "User-Agent": Math.random(),
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
              `https://evilinsult.com/generate_insult.php?lang=${
                Math.random() * 2 === 0 ? "en" : "es"
              }`
            );
            console.log(
              `https://evilinsult.com/generate_insult.php?lang=${
                Math.random() * 2 === 0 ? "en" : "es"
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
