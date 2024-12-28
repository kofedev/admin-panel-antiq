import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CategoryService} from "../../../services/category.service";
import {Router} from "@angular/router";
import {CurrentLanguageService} from "../../../services/current-language.service";
import {Category} from "../../../model/category";
import {Subscription} from "rxjs";
import {UiElementService} from "../../../services/ui-element.service";

@Component({
  selector: 'app-category-tree',
  templateUrl: './category-tree.component.html',
  styleUrls: ['./category-tree.component.scss']
})
export class CategoryTreeComponent implements OnInit, OnDestroy {

  constructor(public categoryService: CategoryService,
              public currentLanguageService: CurrentLanguageService,
              public uiElementService: UiElementService
              // private environment: EnvironmentService
  ) { }

  @Input() currentCategory!: Category;

  languageIsSelected$!: Subscription;
  getRootCategory$!: Subscription;
  getCategoryById$!: Subscription;

  ngOnDestroy() {
    if (this.languageIsSelected$) this.languageIsSelected$.unsubscribe();
    if (this.getCategoryById$) this.getCategoryById$.unsubscribe();
    if (this.getRootCategory$) this.getRootCategory$.unsubscribe();
  }

  ngOnInit(): void {
    this.init()
  }

  init() {

    if (this.currentCategory) {
      this.categoryService.current_category_in_category_tree.categoryId = this.currentCategory.categoryId;
    }

    this.languageIsSelected$ = this.currentLanguageService.languageIsSelected$.subscribe({
      next: value => {
        if (this.categoryService.current_category_in_category_tree.categoryId) {
          this.loadCategoryById(this.categoryService.current_category_in_category_tree.categoryId, false);
        }
      }
    })

  }

  loadCategoryById (categoryId: number, click: boolean) {
    this.getCategoryById$ = this.categoryService.getCategoryById(categoryId).subscribe({
      next: value => {
        this.currentCategory = structuredClone(value);
        this.categoryService.current_category_in_category_tree = structuredClone(this.currentCategory);
        if (click) this.categoryService.click_in_category_tree_id$.next(categoryId);
      }
    })
  }

}
