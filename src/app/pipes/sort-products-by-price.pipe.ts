import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortProductsByPrice'
})
export class SortProductsByPricePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
