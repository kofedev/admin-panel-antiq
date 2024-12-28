import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EnvironmentService} from "./environment.service";
import {CategoryParent} from "../model/category-parent";
import {Observable, Subject} from "rxjs";
import {Category} from "../model/category";
import {Product} from "../model/product";
import {ProductFull} from "../model/product-full";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient, private environment: EnvironmentService) { }

  public productLocationChanged$ = new Subject<number>();

  public createEmptyProductByParent(parentCategory: CategoryParent): Observable<Product> {
    return this.http.post<Product>(this.environment.baseUrl + "/product", parentCategory);
  }

  public getAllProductsByCategoryId_short(parentCategoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(this.environment.baseUrl + "/product/short/category/" + parentCategoryId);
  }

  public getProductById_short(productId: number): Observable<Product> {
    return this.http.get<Product>(this.environment.baseUrl + "/product/common/short/" + productId);
  }

  public getAllProductsByCategoryId_full(parentCategoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(this.environment.baseUrl + "/product/full/category/" + parentCategoryId);
  }

  public getProductById_full(productId: number): Observable<Product> {
    return this.http.get<Product>(this.environment.baseUrl + "/product/common/full/" + productId);
  }

  public getProductById_full_orders(productId: number): Observable<ProductFull> {
    return this.http.get<ProductFull>(this.environment.baseUrl + "/product/full/orders/" + productId);
  }

  public cloneProductByPatternProductId(productId: number): Observable<Product> {
    return this.http.get<Product>(this.environment.baseUrl + "/product/clone/" + productId);
  }

  public updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(this.environment.baseUrl + "/product", product);
  }

  public deleteProduct(productId: number): Observable<any> {
    return this.http.delete<any>(this.environment.baseUrl + "/product/" + productId);
  }

}
