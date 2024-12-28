import {Descriptor} from "./descriptor";
import {CategoryParent} from "./category-parent";

export interface CategoryUpdate {
  categoryId: number,
  active: boolean,
  titleDescriptors: Descriptor[],
  parent: CategoryParent,
}
