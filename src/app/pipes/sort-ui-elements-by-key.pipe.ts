import { Pipe, PipeTransform } from '@angular/core';
import {UiElement} from "../model/ui-element";

@Pipe({
  name: 'sortUiElementsByKey',
  standalone: true
})
export class SortUiElementsByKeyPipe implements PipeTransform {

  transform(uiElements: UiElement[]): UiElement[] {
    return uiElements.sort( (a, b) => b.key - a.key );
  }

}
