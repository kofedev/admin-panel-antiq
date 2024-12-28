import {Descriptor} from "./descriptor";

export interface CategorySub {
  categoryId: number,
  active: boolean,
  titleDescriptors: Descriptor[]
}
