import moment from "moment";
import { Constants } from "../../constants";
import { ShoppingList, Item } from "../../entities/ShoppingList";
import ItemShopService from "./item-shop.service";

class ItemShopController {
  itemShopService: ItemShopService;
  constructor() {
    this.itemShopService = new ItemShopService();
  }

  async scheduleScrappingForNA() {
    let target = moment().utc().hour(17).minute(5);
    const current = moment().utc();
    let delay = target.valueOf() - current.valueOf();
    if (delay < 0) {
      target.add(1, "day");
      delay = target.valueOf() - current.valueOf();
    }
    console.log(`Scrapping for NA in ${delay} milliseconds, ${target}`);
    //delay = 0;
    setTimeout(async () => {
      try {
        console.log("Performing Scraping for NA");
        await this.performScraping(Constants.ITEM_SHOP.URL.NA);
        console.log("Scraping for NA completed");
      } catch (err) {
        console.log(err);
      } finally {
        this.scheduleScrappingForNA();
      }
    }, delay);
  }

  async scheduleScrappingForDE() {
    let target = moment().utc().hour(8).minute(5);
    const current = moment().utc();
    let delay = target.valueOf() - current.valueOf();
    if (delay < 0) {
      target.add(1, "day");
      delay = target.valueOf() - current.valueOf();
    }
    console.log(`Scrapping for DE in ${delay} milliseconds, ${target}`);
    //delay = 0;
    setTimeout(async () => {
      try {
        console.log("Performing Scraping for DE");
        await this.performScraping(Constants.ITEM_SHOP.URL.DE);
        console.log("Scraping for DE completed");
      } catch (err) {
        console.log(err);
      } finally {
        this.scheduleScrappingForDE();
      }
    }, delay);
  }

  async performScraping(url: string) {
    const mainPage = await this.itemShopService.getHtml(url);
    console.log("Obtained main page in HTML");
    const categories = await this.itemShopService.getCategories(mainPage);
    console.log("Obtained categories");
    const shoppingList: ShoppingList[] = [];
    for (const category of categories) {
      const categoryPage = await this.itemShopService.getHtml(
        category.link || ""
      );
      const items: Item[] = await this.itemShopService.getItems(categoryPage);
      shoppingList.push({
        category: category.category,
        items,
      });
    }
    console.log("Sending Embedded Messages");
    await this.itemShopService.sendEmbeddedMessages(shoppingList);
    console.log("Embedded Messages has been sent");
  }
}

export default ItemShopController;
