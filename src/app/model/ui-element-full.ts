import {Descriptor} from "./descriptor";

export interface UiElementFull {
  uiElementId: number;
  key: number;
  isBig: boolean;
  descriptors: Descriptor[],
  setId: number
  isLast?: boolean;
}
