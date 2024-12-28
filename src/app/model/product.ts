import {Descriptor} from "./descriptor";
import {CategoryParent} from "./category-parent";
import {Image} from "./image";

export interface Product {
  productId: number,
  active: boolean,
  titleDescriptors: Descriptor[],
  briefDescriptors: Descriptor[],
  fullDescriptors: Descriptor[],
  fullDescriptorSetId: number,
  partNumber: string,
  offerPrice: number,
  currentQuantity: number,
  keyWords: string,
  note: string,
  publishedOn?: Date,
  category: CategoryParent,
  images: Image[],
  title?: string
}

