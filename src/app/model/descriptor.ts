import {Language} from "./language.model";

export interface Descriptor {
  descriptorId: number,
  isBig: boolean,
  isSearchable: boolean,
  value: string,
  language: Language
}
