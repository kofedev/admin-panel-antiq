import { Pipe, PipeTransform } from '@angular/core';
import {Image} from "../model/image";
import {EnvironmentService} from "../services/environment.service";

@Pipe({
  name: 'imageByMain'
})
export class ImageByMainPipe implements PipeTransform {

  constructor(private environmentService: EnvironmentService) {
  }
  transform(value: Image[]): String | undefined {
    for (let image of value) {
      if (image.mainImage) return image.imageUrl;
    }
    return this.environmentService.noImagePictureUrl;
  }

}
