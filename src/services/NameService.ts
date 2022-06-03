import { Name } from "../models/Name";
import DiscordJS from "discord.js";

class NameService {
  message: DiscordJS.Message;
  args: string[];
  constructor(message: DiscordJS.Message, args: string[]) {
    this.message = message;
    this.args = args;
  }

  async addName() {
    try {
      let type = this.args[1];
      if (!type) {
        return this.message.reply({
          content: "Second argument cannot be empty",
        });
      }
      type = type.toLowerCase().trim();
      if (type !== "enemy" && type !== "ally")
        return this.message.reply({
          content: "Second argument only accepts ***enemy*** or ***ally***",
        });
      let name = this.args[2];
      if (!name) {
        return this.message.reply({
          content: "Third argument cannot be empty",
        });
      }
      name = name.toLowerCase().trim();
      const isEnemy = this.args[1].toLowerCase() === "enemy" ? true : false;
      await Name.create({
        name,
        isEnemy,
      });
      this.message.reply({
        content: `${isEnemy ? "Enemy" : "Ally"} ***${name}*** has been added`,
      });
    } catch (err: any) {
      console.log(err.code, err.message);
      if (err.code === 11000) {
        return this.message.reply({
          content:
            "This name already exist in the database, maybe you want to use !remove instead",
        });
      }
      return this.message.reply({
        content: err.message,
      });
    }
  }

  async removeName() {
    try {
      let name = this.args[1];
      if (!name) {
        return this.message.reply({
          content:
            "Argument cannot be empty, example command: ***!remove <name>***",
        });
      }
      name = this.args[1].toLowerCase().trim();
      const res = await Name.deleteOne({
        name,
      });
      if (res.deletedCount === 0) {
        throw {
          code: "DeletedCountZero",
          message: `${name} does not exist in database`,
        };
      }
      console.log(res);
      this.message.reply({
        content: `***${name}*** has been removed`,
      });
    } catch (err: any) {
      console.log(err.code, err.message);
      return this.message.reply({
        content: err.message,
      });
    }
  }
}

export default NameService;
