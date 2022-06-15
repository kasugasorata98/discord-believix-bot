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
    let target = moment().hours(17).startOf('hour');
    const current = moment();
    let delay = target.valueOf() - current.valueOf();
    if (delay < 0) {
      target.add(1, "day");
      delay = target.valueOf() - current.valueOf();
    }
    console.log(`Scrapping for NA in ${delay} milliseconds`);
    //delay = 0;
    setTimeout(async () => {
      try {
        await this.performScraping(Constants.ITEM_SHOP.URL.NA);
      } catch (err) {
        console.log(err);
      } finally {
        this.scheduleScrappingForNA();
      }
    }, delay);
  }

  async scheduleScrappingForDE() {
    let target = moment().hour(8).startOf('hour');
    const current = moment();
    let delay = target.valueOf() - current.valueOf();
    if (delay < 0) {
      target.add(1, "day");
      delay = target.valueOf() - current.valueOf();
    }
    console.log(`Scrapping for DE in ${delay} milliseconds`);
    //delay = 0;
    setTimeout(async () => {
      try {
        await this.performScraping(Constants.ITEM_SHOP.URL.DE);
      } catch (err) {
        console.log(err);
      } finally {
        this.scheduleScrappingForDE();
      }
    }, delay);
  }

  async performScraping(url: string) {
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
  }
}

export default ItemShopController;
