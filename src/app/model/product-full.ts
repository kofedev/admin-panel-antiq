import {Order} from "./order";
import {Product} from "./product";
import {Category} from "./category";

export interface ProductFull {
  product: Product;
  orders: Order[];
  category: Category;
}
