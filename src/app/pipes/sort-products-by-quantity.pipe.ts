import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortProductsByQuantity'
})
export class SortProductsByQuantityPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
