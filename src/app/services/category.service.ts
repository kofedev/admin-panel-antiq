import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EnvironmentService} from "./environment.service";
import {Observable, Subject} from "rxjs";
import {Language} from "../model/language.model";
import {Category} from "../model/category";
import {CategoryParent} from "../model/category-parent";
import {CategoryUpdate} from "../model/category-update";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient, private environment: EnvironmentService) { }

  public root_category!: Category; // @ToDo  check and delete?

  public click_in_category_tree_id$= new Subject<number>();
  public current_category_in_category_tree!: Category | CategoryParent;

  public getRootCategory(): Observable<Category> {
    return this.http.get<Category>(this.environment.baseUrl + "/category/common/root");
  }

  public getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.environment.baseUrl + "/category");
  }

  public getCategoryById(categoryId: number): Observable<Category> {
    return this.http.get<Category>(this.environment.baseUrl + "/category/common/" + categoryId);
  }

  public createEmptyCategoryByParent(parentCategory: CategoryParent): Observable<Category> {
    return this.http.post<Category>(this.environment.baseUrl + "/category", parentCategory);
  }

  public updateCategory(categoryToUpdate: CategoryUpdate): Observable<Category> {
    return this.http.put<Category>(this.environment.baseUrl + "/category", categoryToUpdate);
  }

  public deleteCategory(categoryId: number): Observable<any> {
    return this.http.delete<any>(this.environment.baseUrl + "/category/" + categoryId);
  }

  public isPossibleToRelocate(categoryId: number, destinationId: number): Observable<boolean> {
    return this.http.get<any>(this.environment.baseUrl + "/category/possible_to_relocate?categoryId=" + categoryId + "&destinationId=" + destinationId);
  }

}
