import cheerioModule from "cheerio";
import { MessageEmbed, TextChannel } from "discord.js";
import { Constants } from "../../constants";
import { Category } from "../../entities/Category";
import { Item, ShoppingList } from "../../entities/ShoppingList";
import DiscordClient from "../../lib/DiscordClient";
import { Util } from "../../utils/Util";
import puppeteer from "puppeteer-extra";
import { PuppeteerExtraPluginRecaptcha } from "puppeteer-extra-plugin-recaptcha";
puppeteer.use(
  new PuppeteerExtraPluginRecaptcha({
    provider: {
      id: "2captcha",
      token: "566e76741ea21533d971216826730bec",
    },
    visualFeedback: true, // colorize reCAPTCHAs (violet = detected, green = solved)
  })
);

class ItemShopService extends DiscordClient {
  constructor() {
    super();
  }

  async getHtml(url: string): Promise<string> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (
        req.resourceType() == "stylesheet" ||
        req.resourceType() == "font" ||
        req.resourceType() == "image"
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });
    await page.evaluateOnNewDocument(() => {
      // Pass webdriver check
      Object.defineProperty(navigator, "webdriver", {
        get: () => false,
      });
    });

    await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });
    const captcha = await page.solveRecaptchas();
    console.log(captcha);
    await page.waitForNavigation({
      waitUntil: "networkidle2",
    });
    const content = await page.content();
    await browser.close();
    //console.log(content);
    return content;
  }

  async getCategories(html: string): Promise<Category[]> {
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

  async getItems(html: string): Promise<Item[]> {
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
      let channel: TextChannel;
      switch (list.category) {
        case Constants.ITEM_SHOP.CATEGORY.ITEM_OF_THE_DAY_EN:
          channel = this.getChannelByName(
            Constants.CHANNEL.ITEM_OF_THE_DAY_EN
          ) as TextChannel;
          break;
        case Constants.ITEM_SHOP.CATEGORY.ITEM_OF_THE_DAY_DE:
          channel = this.getChannelByName(
            Constants.CHANNEL.ITEM_OF_THE_DAY_DE
          ) as TextChannel;
          break;
        case Constants.ITEM_SHOP.CATEGORY.HOT_OFFERS_EN:
          channel = this.getChannelByName(
            Constants.CHANNEL.HOT_OFFERS_EN
          ) as TextChannel;
          break;
        case Constants.ITEM_SHOP.CATEGORY.HOT_OFFERS_DE:
          channel = this.getChannelByName(
            Constants.CHANNEL.HOT_OFFERS_DE
          ) as TextChannel;
          break;
        default:
          console.log("No such category: " + list.category);
          return;
      }
      console.log("Category: ", list.category);
      //channel = this.getChannelByName(Constants.CHANNEL.DEVELOPER);
      if (!list.items || list.items?.length === 0) {
        return;
      }
      const embeddedMessages: MessageEmbed[] = [];
      list.items.sort(function (a: Item, b: Item) {
        return a.itemName.length - b.itemName.length;
      })[0].itemName.length;
      for (const item of list.items) {
        console.log("Item: ", `Name: ${item.itemName} Cost: ${item.itemCost}`);
        const embeddedMessage = new MessageEmbed()
          .setDescription(list.category)
          .setThumbnail(item.itemImage || "")
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
          );
        embeddedMessages.push(embeddedMessage);
        await Util.sleep(100);
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
