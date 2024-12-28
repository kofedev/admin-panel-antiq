import { Pipe, PipeTransform } from '@angular/core';
import {Category} from "../model/category";
import {LanguageService} from "../services/language.service";
import {LanguageSelectorComponent} from "../components/language-selector/language-selector.component";
import {CurrentLanguageService} from "../services/current-language.service";

@Pipe({
  name: 'sortSubCategories'
})
export class SortSubCategoriesPipe implements PipeTransform {

  constructor(private currentLanguageService: CurrentLanguageService) { }

  transform(value: Category[]): Category[] {
    let outputSubCategories: Category[] = [];
    // clear by current language
    for (let category of value) {
      let categoryToPush: Category;
      categoryToPush = category;
      for (let descriptor of category.titleDescriptors) {
        if (descriptor.language.languageId === this.currentLanguageService.currentLanguage.languageId) {
          categoryToPush.title = descriptor.value;
        }
      }
      outputSubCategories.push(categoryToPush);
    }

    // sort and return the result
    return outputSubCategories.sort((a, b) => a.title!.localeCompare(b.title!));
  }

}

