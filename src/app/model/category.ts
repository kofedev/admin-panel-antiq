import {CategoryParent} from "./category-parent";
import {Product} from "./product";
import {Descriptor} from "./descriptor";

export interface Category {
  categoryId: number,
  active: boolean,
  root: boolean,
  titleDescriptors: Descriptor[],
  parent: CategoryParent,
  subcategories: Category[],
  products: Product[],
  title?: string
}
