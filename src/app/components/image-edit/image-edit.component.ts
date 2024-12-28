import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ImageService} from "../../services/image.service";
import {Product} from "../../model/product";
import {Image} from "../../model/image";
import {EnvironmentService} from "../../services/environment.service";
import {Subscription} from "rxjs";
import {UiElementService} from "../../services/ui-element.service";

@Component({
  selector: 'app-image-edit',
  templateUrl: './image-edit.component.html',
  styleUrls: ['./image-edit.component.scss']
})
export class ImageEditComponent implements OnDestroy {
  @ViewChild('myElement') myElement: ElementRef | undefined;

  constructor(private imageService: ImageService,
              private environmentService: EnvironmentService,
              public uiElementService: UiElementService) { }

  @Input() product!: Product;
  _showImageList: boolean = false;
  file!: File | null;
  _showMessageAspectRatio: boolean = false;
  _showMessageFileSize: boolean = false;
  _showImageHasBeenUploaded = false;
  _partOfAspectRatioMessagePartOf: string = this.environmentService.aspectRatio_ImageFile_PartOfMessage;

  public readonly IMAGE_FILE_MAX_SIZE = 500_000; // 500Kb.
  // public readonly IMAGE_FILE_MAX_SIZE = 20000; // 1 Mb.

  uploadImageFile$!: Subscription;
  setImageAsMain$!: Subscription;
  deleteImage$!: Subscription;

  ngOnDestroy(): void {
    if (this.uploadImageFile$) this.uploadImageFile$.unsubscribe();
    if (this.setImageAsMain$) this.setImageAsMain$.unsubscribe();
    if (this.deleteImage$) this.deleteImage$.unsubscribe();
  }

  onFileChange(event: any) {
    this.file = event.target.files[0];

    if (this.file) {
      this._showMessageFileSize = false;
      this._showMessageAspectRatio = false;

      //console.log("FILE SIZE: " + this.file.size);
      if (this.file.size > this.IMAGE_FILE_MAX_SIZE) {
        this._showMessageFileSize = true;
        return;
      }

      const img = new Image();
      img.src = URL.createObjectURL(this.file);
      img.onload = () => {
        // console.log('Image width:', img.width);
        // console.log('Image height:', img.height);
        let aspectRatio_WH = img.width / img.height;
        if (this.environmentService.aspectRatio_WH_ImageFile != aspectRatio_WH) {
          this._showMessageAspectRatio = true;
        } else {
          this._showMessageAspectRatio = false;
        }
      };

    } else {
      this._showMessageFileSize = false;
      this._showMessageAspectRatio = false;
    }

  }

  upload() {
    if (this.file) {

      //console.log("FILE SIZE: " + this.file.size);
      if (this.file.size > this.IMAGE_FILE_MAX_SIZE) {
        return;
      }

      this.uploadImageFile$ = this.imageService.uploadImageFile(this.file, this.product.productId).subscribe({
        next: data => {
          // console.log("Uploaded");
          this.product.images.push(data);
          this.file = null;
          this.resetInput();
          this._showMessageAspectRatio = false;
          this._showMessageFileSize = false;
          this._showImageHasBeenUploaded = true;
        }
      });

    } else {
      // console.log("Error upload file");
    }
  }

  setImageAsMain(image: Image) {
    this.setImageAsMain$ = this.imageService.setImageAsMain(image, image.imageId).subscribe({
      next: value => {
        for (let imageInList of this.product.images) {
          if (imageInList.imageId === image.imageId) {
            imageInList.mainImage = true;
          } else {
            imageInList.mainImage = false;
          }
        }
      }
    })

  }

  deleteImage(image: Image) {
    this.deleteImage$ = this.imageService.deleteImage(image.imageId).subscribe({
      next: value => {
        let newImageList: Image[] = [];
        for (let imageInList of this.product.images) {
          if (imageInList.imageId != image.imageId) {
            newImageList.push(imageInList);
          }
        }
        this.product.images = [];
        this.product.images = structuredClone(newImageList);
      }
    })
  }

  resetInput() {
    // Reset the input field value to clear it
    this.myElement!.nativeElement.value = '';
  }

}
