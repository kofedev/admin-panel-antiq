import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EnvironmentService} from "./environment.service";
import {Observable} from "rxjs";
import {Image} from "../model/image";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient, private environment: EnvironmentService) { }

  public uploadImageFile = (file: File, productId: number): Observable<Image> => {
    let formParams = new FormData();
    formParams.append('file', file);
    return this.http.post<Image>(this.environment.baseUrl + "/image/product/" + productId, formParams);
  };

  public getImageById (imageId: number): Observable<Image> {
    return this.http.get<Image>(this.environment.baseUrl + "/image/common/" + imageId);
  }

  public setImageAsMain (image: Image, imageId: number): Observable<Image> {
    return this.http.put<Image>(this.environment.baseUrl + "/image/mainstatus/" + imageId, image);
  }

  public deleteImage(imageId: number): Observable<any> {
    return this.http.delete<any>(this.environment.baseUrl + "/image/" + imageId);
  }

}
