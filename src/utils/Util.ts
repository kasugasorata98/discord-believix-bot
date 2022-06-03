import { Name } from "../models/Name";

export const Util = {
  containsName: (arr: Name[], message: string): boolean | string => {
    for (const name of arr) {
      if (message.toLocaleLowerCase().includes(`${name.name}`)) {
        return name.name;
      }
    }
    return false;
  },
};
