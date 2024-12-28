import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'urlFileName'
})
export class UrlFileNamePipe implements PipeTransform {

  transform(url: string): string {
    return url.substring(url.lastIndexOf("/") + 1);
  }

}
