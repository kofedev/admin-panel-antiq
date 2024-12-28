import { Pipe, PipeTransform } from '@angular/core';
import {Order} from "../model/order";

@Pipe({
  name: 'orderById',
  standalone: true
})
export class OrderByIdPipe implements PipeTransform {

  transform(orderList: Order[]): Order[] {
    return orderList.sort((a, b) => {
        return b.orderId - a.orderId;
    });
  }
}
