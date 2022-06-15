import moment from "moment";
import { Constants } from "../constants";
import { ShoppingList, Item } from "../entities/ShoppingList";
import ItemShopService from "../services/ItemShopService";

class ItemShopController {
  itemShopService: ItemShopService;
  constructor() {
    this.itemShopService = new ItemShopService();
  }

  async scheduleScrappingForNA() {
    let target = moment().hours(17).minutes(5);
    const current = moment();
    let delay = target.valueOf() - current.valueOf();
    if (delay < 0) {
      target.add(1, "day");
      delay = target.valueOf() - current.valueOf();
    }
    console.log(`Scrapping for NA in ${delay} milliseconds`);
    //delay = 0;
    setTimeout(() => {
      this.performScraping(Constants.ITEM_SHOP.URL.NA);
    }, delay);
  }

  async scheduleScrappingForDE() {
    let target = moment().hour(8).minutes(5);
    const current = moment();
    let delay = target.valueOf() - current.valueOf();
    if (delay < 0) {
      target.add(1, "day");
      delay = target.valueOf() - current.valueOf();
    }
    console.log(`Scrapping for DE in ${delay} milliseconds`);
    //delay = 0;
    setTimeout(() => {
      this.performScraping(Constants.ITEM_SHOP.URL.DE);
    }, delay);
  }

  async performScraping(url: string) {
    try {
      const mainPage = await this.itemShopService.getHtml(url);
      const categories = await this.itemShopService.getCategories(mainPage);
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
      this.itemShopService.sendEmbeddedMessages(shoppingList);
    } catch (err) {
      console.log(err);
    } finally {
      this.scheduleScrappingForNA();
      this.scheduleScrappingForDE();
    }
  }
}

export default ItemShopController;
