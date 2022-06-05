import { Name } from "../models/Name";
import DiscordJS from "discord.js";
import { Constants } from "../constants";

class NameService {
  message: DiscordJS.Message;
  args: string[];
  constructor(message: DiscordJS.Message, args: string[]) {
    this.message = message;
    this.args = args;
  }

  async addName() {
    try {
      if (this.args.length !== 3) {
        return await this.message.reply({
          content:
            "Is it an enemy or ally? and who? Please provide the necessary arguments",
        });
      }
      let type = this.args[1];
      type = type.toLowerCase().trim();
      if (type !== "enemy" && type !== "ally")
        return await this.message.reply({
          content: "Second argument only accepts ***enemy*** or ***ally***",
        });
      let name = this.args[2];
      name = name.toLowerCase().trim();
      if (name.length > 15) {
        return await this.message.reply({
          content: "Name cannot be more than 15 letters",
        });
      }
      const isEnemy = this.args[1].toLowerCase() === "enemy" ? true : false;
      await Name.create({
        name,
        isEnemy,
      });
      await this.message.reply({
        content: `${isEnemy ? "Enemy" : "Ally"} ***${name}*** has been added`,
      });
    } catch (err: any) {
      console.log(err.code, err.message);
      if (err.code === 11000) {
        return await this.message.reply({
          content:
            "This name already exist in the database, maybe you want to use !remove instead",
        });
      }
      return await this.message.reply({
        content: err.message,
      });
    }
  }

  async removeName() {
    try {
      if (this.args.length !== 2) {
        return await this.message.reply({
          content: "Who did you want to remove?",
        });
      }
      let name = this.args[1];
      if (!name) {
        return await this.message.reply({
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
      await this.message.reply({
        content: `***${name}*** has been removed`,
      });
    } catch (err: any) {
      console.log(err.code, err.message);
      return await this.message.reply({
        content: err.message,
      });
    }
  }

  async listNames() {
    let type = this.args[1]; //enemy or ally or enemies or allies
    let isEnemy = false;
    switch (type) {
      case "enemy":
      case "enemies":
        isEnemy = true;
        break;
      case "ally":
      case "allies":
        isEnemy = false;
        break;
      default:
        return await this.message.reply({
          content:
            "Invalid second argument, try !list followed by enemy, enemies, ally, or allies",
        });
    }
    try {
      const res = await Name.find({
        isEnemy,
      }).select("name");
      let list = "";
      for (let i = 0; i < res.length; i++) {
        if (res.length - 1 === i) {
          list += res[i].name;
        } else {
          list += res[i].name + ",";
        }
      }

      while (list.length > Constants.DEFAULT_MESSAGE_LENGTH) {
        // because discord message limit default is 2000
        const extracted = list.substring(0, Constants.DEFAULT_MESSAGE_LENGTH);
        await this.message.reply({
          content: extracted,
        });
        list = list.substring(Constants.DEFAULT_MESSAGE_LENGTH);
      }

      if (list.length > 0) {
        return await this.message.reply({
          content: list,
        });
      }
    } catch (err: any) {
      return await this.message.reply({
        content: err.message,
      });
    }
  }
}

export default NameService;
