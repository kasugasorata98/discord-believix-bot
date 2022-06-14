export type Item = {
  itemName: string;
  itemLink?: string;
  itemImage?: string;
  itemCost: string;
};

export type ShoppingList = {
  category: string;
  items?: Item[];
};
