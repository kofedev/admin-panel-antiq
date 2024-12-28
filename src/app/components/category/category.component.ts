import {Component, OnDestroy, OnInit} from '@angular/core';
import {Category} from "../../model/category";
import {CategoryService} from "../../services/category.service";
import {CategoryParent} from "../../model/category-parent";
import {ActivatedRoute, Router} from "@angular/router";
import {CategorySub} from "../../model/category-sub";
import {CurrentLanguageService} from "../../services/current-language.service";
import {EnvironmentService} from "../../services/environment.service";
import {Subscription} from "rxjs";
import {UiElementService} from "../../services/ui-element.service";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy {

  categoryId: number | undefined;
  currentCategory!: Category;
  _inProgress: boolean = false;

  languageIsSelected$!: Subscription;
  getCategoryById$!: Subscription
  createEmptyCategoryByParent$!: Subscription;
  params$!: Subscription;

  ngOnDestroy(): void {
    if (this.getCategoryById$) this.getCategoryById$.unsubscribe();
    if (this.createEmptyCategoryByParent$) this.createEmptyCategoryByParent$.unsubscribe();
    if (this.languageIsSelected$) this.languageIsSelected$.unsubscribe();
    if (this.params$) this.params$.unsubscribe();
  }

  constructor(private categoryService: CategoryService,
              private router: Router,
              private route: ActivatedRoute,
              public currentLanguageService: CurrentLanguageService,
              public uiElementService: UiElementService
              // private environment: EnvironmentService
  ) { }

  ngOnInit(): void {
    this.params$ = this.route.params.subscribe(params => {
      this.categoryId = +params['categoryId'];
      if (this.categoryId != undefined) {
        this.loadCategoryById(this.categoryId);
      } else {
        console.error("There is no category's ID") }
    });

    this.languageIsSelected$ = this.currentLanguageService.languageIsSelected$.subscribe({
      next: value => { this.loadCategoryById(this.categoryId!) }
    })
  }

  loadCategoryById(categoryId: number) {
    this.getCategoryById$ = this.categoryService.getCategoryById(categoryId).subscribe({
      next: value => {
        if (value) {
          this.currentCategory = structuredClone(value);
        }
      }
    })
  }

  createNewEmptyCategory(parent: Category) {
    let parentCategory: CategoryParent = {
      categoryId: parent.categoryId,
      active: true,
      root: false,
      titleDescriptors: []
    };
    this.createEmptyCategoryByParent$ = this.categoryService.createEmptyCategoryByParent(parentCategory).subscribe({
      next: value => {
        this.goToEditCategory(value.categoryId);
      }
    })
  }

  goToEditCategory(categoryId: number) {
    this.router.navigateByUrl("/category/edit/" + categoryId).then(r => console.log("Routing"));
  }

  goToCategory (categorySub: CategorySub) {
    // this.loadCategoryById(categorySub.categoryId);
    this.router.navigateByUrl("/category/" + categorySub.categoryId).then(r => console.log("Routing"));
  }

}
