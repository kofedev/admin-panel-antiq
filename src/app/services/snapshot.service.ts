import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EnvironmentService} from "./environment.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SnapshotService {

  constructor(private http: HttpClient, private environment: EnvironmentService) { }

  exportCategoriesToJson(): Observable<Blob> {
    const url = `${this.environment.baseUrl}/snapshot/categories`;
    return this.http.get(url, { responseType: 'blob' });
  }

  exportProductsToJson(): Observable<Blob> {
    const url = `${this.environment.baseUrl}/snapshot/products`;
    return this.http.get(url, { responseType: 'blob' });
  }



}
