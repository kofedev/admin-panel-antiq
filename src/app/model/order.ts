import {CartCell} from "./cart-cell";

export interface Order {
  // cart data
  orderId: number;
  cartCells: CartCell[];
  total?: number; // summary cost
  // customer's personal data
  name?: string;
  phone?: string;
  email: string;
  isInterestLetterSent: boolean;
  lastVisit: Date;
  // system data
  createdDate: Date;
  searches?: string[]
  // language
  languageId?: number;
  languageCode?: string;
  // status and note
  active: boolean;
  note: string;
  message?: string;
  ipAddress?: string;
}
