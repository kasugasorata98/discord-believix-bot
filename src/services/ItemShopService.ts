import cheerioModule from "cheerio";
import { MessageEmbed, TextChannel } from "discord.js";
import { Constants } from "../constants";
import { Category } from "../entities/Category";
import { Item, ShoppingList } from "../entities/ShoppingList";
import AxiosClient from "../lib/AxiosClient";
import DiscordClient from "../lib/DiscordClient";
import { Util } from "../utils/Util";

class ItemShopService extends DiscordClient {
  constructor() {
    super();
  }

  async getCategories(url: string): Promise<Category[]> {
    const { data: html } = await AxiosClient.get(url);
    const mainPage = cheerioModule.load(html);

    const ul = mainPage(".level1");
    const categories: Category[] = [];
    ul.each((_index, element) => {
      const li = mainPage(element).find("a");
      li.each((_index, element) => {
        const category = mainPage(element).text();
        const link = mainPage(element).attr("href");
        if (
          [
            Constants.ITEM_SHOP.CATEGORY.ITEM_OF_THE_DAY_EN,
            Constants.ITEM_SHOP.CATEGORY.ITEM_OF_THE_DAY_DE,
            Constants.ITEM_SHOP.CATEGORY.HOT_OFFERS_EN,
            Constants.ITEM_SHOP.CATEGORY.HOT_OFFERS_DE,
          ].some((v) => category.includes(v))
        ) {
          categories.push({
            category,
            link: link,
          });
        }
      });
    });
    return categories;
  }

  async getItems(category: any): Promise<Item[]> {
    const { data: html } = await AxiosClient.get(category.link);
    const categoryPage = cheerioModule.load(html);
    const accordion = categoryPage("#accordion");
    const li = accordion.find("li");
    const items: Item[] = [];
    li.each((_index, element) => {
      const itemName = categoryPage(element).find(".itemtitle").text();
      const itemLink = categoryPage(element).find(".imgwrap a").attr("href");
      const itemImage = categoryPage(element).find("img").attr("src");
      const itemCost = categoryPage(element).find(".moneybox").text();
      const itemDiscount = categoryPage(element).find(".stoerer").text();
      items.push({
        itemName,
        itemLink: itemLink,
        itemImage: itemImage,
        itemCost,
        itemDiscount,
      });
    });
    return items;
  }

  async sendEmbeddedMessages(shoppingList: ShoppingList[]): Promise<void> {
    for (const list of shoppingList) {
      let channel: TextChannel | null;
      switch (list.category) {
        case Constants.ITEM_SHOP.CATEGORY.ITEM_OF_THE_DAY_EN:
          channel = this.getChannelByName(Constants.CHANNEL.ITEM_OF_THE_DAY_EN);
          break;
        case Constants.ITEM_SHOP.CATEGORY.ITEM_OF_THE_DAY_DE:
          channel = this.getChannelByName(Constants.CHANNEL.ITEM_OF_THE_DAY_DE);
          break;
        case Constants.ITEM_SHOP.CATEGORY.HOT_OFFERS_EN:
          channel = this.getChannelByName(Constants.CHANNEL.HOT_OFFERS_EN);
          break;
        case Constants.ITEM_SHOP.CATEGORY.HOT_OFFERS_DE:
          channel = this.getChannelByName(Constants.CHANNEL.HOT_OFFERS_DE);
          break;
        default:
          console.log("No such category: " + list.category);
          return;
      }

      //channel = this.getChannelByName(Constants.CHANNEL.DEVELOPER);
      if (!list.items || list.items?.length === 0) {
        return;
      }
      const embeddedMessages: MessageEmbed[] = [];
      for (const item of list.items) {
        const embeddedMessage = new MessageEmbed()
          .setAuthor({ name: "Believix [Bot]" })
          .setDescription(list.category)
          .setColor("#0099ff")
          .setTitle(item.itemName)
          .setURL(item.itemLink || "")
          .addFields(
            {
              name: "Slime Coin Cost",
              value: item.itemCost,
              inline: true,
            },
            {
              name: "Discount",
              value: item.itemDiscount || "0%",
              inline: true,
            }
          )
          .setImage(item.itemImage || "")
          .setTimestamp();
        embeddedMessages.push(embeddedMessage);
      }

      if (embeddedMessages.length > 0) {
        await Util.clearChannelMessages(channel);
      }

      const chunkSize = 10;
      for (let i = 0; i < embeddedMessages.length; i += chunkSize) {
        const chunk = embeddedMessages.slice(i, i + chunkSize);
        if (channel) {
          await channel.send({
            embeds: chunk,
          });
        }
      }
    }
    const generalChannel: TextChannel | null = this.getChannelByName(
      Constants.CHANNEL.GENERAL
    );
    if (shoppingList.length != 0)
      await generalChannel?.send({
        content: "@everyone, the item shop has been updated.",
      });
  }
}

export default ItemShopService;