import { Pipe, PipeTransform } from '@angular/core';
import {Order} from "../model/order";

@Pipe({
  name: 'orderByDate',
  standalone: true
})
export class OrderByDatePipe implements PipeTransform {
  transform(orderList: Order[]): Order[] {
    return orderList.sort((a, b) => {
      let date_a = new Date(a.createdDate);
      let date_b = new Date(b.createdDate);
      return date_b.getTime() - date_a.getTime();
    });
  }
}

