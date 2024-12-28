import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortProductsByDate'
})
export class SortProductsByDatePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
