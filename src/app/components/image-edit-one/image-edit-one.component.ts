import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Image} from "../../model/image";
import {ActivatedRoute} from "@angular/router";
import {ImageService} from "../../services/image.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-image-edit-one',
  templateUrl: './image-edit-one.component.html',
  styleUrls: ['./image-edit-one.component.scss']
})
export class ImageEditOneComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute, private imageService: ImageService) { }

  imageId: number | undefined;
  image!: Image;
  getImageById$!: Subscription;
  params$!: Subscription;

  ngOnDestroy() {
    if (this.getImageById$) this.getImageById$.unsubscribe();
    if (this.params$) this.params$.unsubscribe();
  }

  ngOnInit(): void {
    this.params$ = this.route.params.subscribe(params => {
      this.imageId = +params['imageId'];
      if (this.imageId != undefined) {
        console.log("IMAGE ID " + this.imageId)
        this.loadImageById(this.imageId);
      } else {
        console.error("There is no image's ID") }
    });
  }

  loadImageById(imageId: number) {
    this.getImageById$ = this.imageService.getImageById(imageId).subscribe({
      next: value => {
        this.image = value;
      }
    })
  }


}
