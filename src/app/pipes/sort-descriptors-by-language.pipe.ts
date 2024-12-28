import { Pipe, PipeTransform } from '@angular/core';
import {Descriptor} from "../model/descriptor";

@Pipe({
  name: 'sortDescriptorsByLanguage',
  standalone: true
})
export class SortDescriptorsByLanguagePipe implements PipeTransform {

  transform(descriptors: Descriptor[]): Descriptor[] {
      return descriptors.sort((a, b) => a.language.languageId - b.language.languageId);
   }

}
