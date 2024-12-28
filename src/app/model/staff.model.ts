import {User} from "./user.model";

export interface Staff {
  staffId:number;
  firstName:string;
  lastName:string;
  user:User;
  isReceiverMails?:boolean;
}
