import {Descriptor} from "./descriptor";

export interface CategoryParent {
  categoryId: number,
  active: boolean,
  root: boolean,
  titleDescriptors: Descriptor[]
}
