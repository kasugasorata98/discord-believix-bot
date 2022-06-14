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
    //target at 10:05am GMT/UTC
    const target = moment()
      .add(1, "days")
      .hours(10)
      .minutes(5)
      .startOf("hour")
      .valueOf();
    const current = moment().valueOf();
    let delay = target - current;
    //delay = 0;
    setTimeout(() => {
      this.performScraping(Constants.ITEM_SHOP.URL.NA);
    }, delay);
  }

  async scheduleScrappingForDE() {
    //target at 10:05am GMT/UTC
    const target = moment()
      .add(1, "days")
      .hour(1)
      .minutes(5)
      .startOf("hour")
      .valueOf();
    const current = moment().valueOf();
    let delay = target - current;
    //delay = 0;
    setTimeout(() => {
      this.performScraping(Constants.ITEM_SHOP.URL.DE);
    }, delay);
  }

  async performScraping(url: string) {
    const categories = await this.itemShopService.getCategories(url);
    const shoppingList: ShoppingList[] = [];
    for (const category of categories) {
      const items: Item[] = await this.itemShopService.getItems(category);
      shoppingList.push({
        category: category.category,
        items,
      });
    }
    this.itemShopService.sendEmbeddedMessages(shoppingList);
  }
}

export default ItemShopController;
