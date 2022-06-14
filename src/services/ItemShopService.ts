import axios from "axios";
import cheerioModule from "cheerio";
import { Category } from "../entities/Category";
import { Item, ShoppingList } from "../entities/ShoppingList";

class ItemShopService {
  constructor() {}

  async performScraping(): Promise<void> {
    const categories = await this.getCategories();
    const shoppingList: ShoppingList[] = [];
    for (const category of categories) {
      const items: Item[] = await this.getItems(category);
      shoppingList.push({
        category: category.category,
        items,
      });
    }
  }

  async getCategories(): Promise<Category[]> {
    const { data: html } = await axios.get(
      "https://en.gamigo.com/fiesta/en/itemshop"
    );
    const mainPage = cheerioModule.load(html);

    const ul = mainPage(".level1");
    const categories: Category[] = [];
    ul.each((_index, element) => {
      const li = mainPage(element).find("a");
      li.each((_index, element) => {
        const category = mainPage(element).text();
        const link = mainPage(element).attr("href");
        if (
          ["Item of the Day", "Hot Offers"].some((v) => category.includes(v))
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
    const { data: html } = await axios.get(category.link);
    const categoryPage = cheerioModule.load(html);
    const accordion = categoryPage("#accordion");
    const li = accordion.find("li");
    const items: Item[] = [];
    li.each((_index, element) => {
      const itemName = categoryPage(element).find(".itemtitle").text();
      const itemLink = categoryPage(element).find(".imgwrap a").attr("href");
      const itemImage = categoryPage(element).find("img").attr("src");
      const itemCost = categoryPage(element).find(".moneybox").text();
      items.push({
        itemName,
        itemLink: itemLink,
        itemImage: itemImage,
        itemCost,
      });
    });
    return items;
  }
}

export default ItemShopService;
