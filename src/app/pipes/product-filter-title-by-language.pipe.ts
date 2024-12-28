import { Pipe, PipeTransform } from '@angular/core';
import {CurrentLanguageService} from "../services/current-language.service";
import {Product} from "../model/product";

@Pipe({
  name: 'productFilterTitleByLanguage'
})
export class ProductFilterTitleByLanguagePipe implements PipeTransform {

  constructor(private currentLanguageService: CurrentLanguageService) { }

  transform(product: Product): Product {

    for (let descriptor of product.titleDescriptors) {
          if (descriptor.language.languageId === this.currentLanguageService.currentLanguage.languageId) {
             product.title = descriptor.value;
             break;
          }
      }

    return product;
  }

}



//  constructor(private currentLanguageService: CurrentLanguageService) { }
//
//   transform(value: Product[]): Product[] {
//     let outputProductList: Product[] = [];
//
//     for (let product of value) {
//       let productToPush: Product;
//       productToPush = product;
//       // clear descriptors by current language
//       for (let descriptor of product.titleDescriptors) {
//           if (descriptor.language.languageId === this.currentLanguageService.currentLanguage.languageId) {
//              productToPush.title = descriptor.value;
//           }
//       }
//       outputProductList.push(productToPush);
//     }
//
//     // sort and return the result
//     return outputProductList.sort((a, b) => a.title!.localeCompare(b.title!));
//   }
