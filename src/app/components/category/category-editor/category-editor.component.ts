import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CategoryService} from "../../../services/category.service";
import {Category} from "../../../model/category";
import {AuthService} from "../../../services/auth.service";
import {CurrentLanguageService} from "../../../services/current-language.service";
import {CategoryUpdate} from "../../../model/category-update";
import {Subscription} from "rxjs";
import {UiElementService} from "../../../services/ui-element.service";

@Component({
  selector: 'app-category-editor',
  templateUrl: './category-editor.component.html',
  styleUrls: ['./category-editor.component.scss']
})
export class CategoryEditorComponent implements OnInit, OnDestroy {

  categoryId: number | undefined;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private categoryService: CategoryService,
              public authService: AuthService,
              public currentLanguageService: CurrentLanguageService,
              public uiElementService: UiElementService) {}

  category!: Category;
  parentCategory!: Category;
  originalParentID!: number;
  rootCategory!: Category;
  _message: string = "";
  _inProgress: boolean = false;
  _showAfterUpdatedMessage: boolean = false;
  _showCategoryTreeToSelectNewLocation: boolean = false;
  _itIsNoPossibleToRelocateShowMessage: boolean = false;

  click_in_category_tree_id$!: Subscription;
  getRootCategory$!: Subscription;
  getCategoryById$!: Subscription;
  isPossibleToRelocate$!: Subscription;
  updateCategory$!: Subscription;
  deleteCategory$!: Subscription;
  params$!: Subscription;
  getParentCategory$!: Subscription;

  ngOnDestroy(): void {
    if (this.click_in_category_tree_id$) this.click_in_category_tree_id$.unsubscribe();
    if (this.getRootCategory$) this.getRootCategory$.unsubscribe();
    if (this.getCategoryById$) this.getCategoryById$.unsubscribe();
    if (this.isPossibleToRelocate$) this.isPossibleToRelocate$.unsubscribe();
    if (this.updateCategory$) this.updateCategory$.unsubscribe();
    if (this.deleteCategory$) this.deleteCategory$.unsubscribe();
    if (this.params$) this.params$.unsubscribe();
    if (this.getParentCategory$) this.getParentCategory$.unsubscribe();
  }

  ngOnInit(): void {
    // Access the route parameter 'languageId'
    this.params$ = this.route.params.subscribe(params => {
      this.categoryId = +params['categoryId']; // '+' is used to convert string to number
      this.loadCategoryById(this.categoryId);
    });
    //
    this.loadRootCategory();
    //
    this.click_in_category_tree_id$ = this.categoryService.click_in_category_tree_id$.subscribe({
      next: value => {
        if (this._showCategoryTreeToSelectNewLocation) {
          this.category.parent = structuredClone(this.categoryService.current_category_in_category_tree);
        }
      }
    })
  }

  loadRootCategory() {
    this.getRootCategory$ = this.categoryService.getRootCategory().subscribe({
      next: root => { if (root) { this.rootCategory = root; } }
    })
  }

  setCurrentCategoryInTree() {
    this.categoryService.current_category_in_category_tree = this.category.parent;
  }

  loadCategoryById(categoryId: number) {
    this.getCategoryById$ = this.categoryService.getCategoryById(categoryId).subscribe({
      next: value => {
        this.category = structuredClone(value);
        this.originalParentID = value.parent.categoryId;

        ////////////////////////////////////////////////////////////////////////////////////
        this.getParentCategory$ = this.categoryService.getCategoryById(this.category.parent.categoryId).subscribe({
          next: cat => { this.parentCategory = structuredClone(cat); }
        })

      }
    })
  }

  returnToViewMode() {
    this.router.navigateByUrl("/category/" + this.category.parent.categoryId).then(r => console.log("Routing"));
  }

  updateCategory() {
    this._inProgress = true;
    // *** check relocation case
    if (this.category.parent.categoryId != this.originalParentID) {
      this.isPossibleToRelocate$ = this.categoryService.isPossibleToRelocate(this.categoryId!, this.category.parent.categoryId).subscribe({
        next: decision => {
          if (decision) { this.updateCategoryProcess(); } else { this._itIsNoPossibleToRelocateShowMessage = true; }
        }
      })
    } else {
      this.updateCategoryProcess();
    }
  }

  updateCategoryProcess() {
    // *** main process
    const categoryToUpdate: CategoryUpdate = {
      categoryId: this.category.categoryId,
      active: this.category.active,
      parent: this.category.parent,
      titleDescriptors: []
    }
    for (let descriptor of this.category.titleDescriptors) {
      categoryToUpdate.titleDescriptors.push(descriptor);
    }
    this.updateCategory$ = this.categoryService.updateCategory(categoryToUpdate).subscribe({
      next: value => {
        this.loadCategoryById(categoryToUpdate.categoryId);
        this._inProgress = false;
        this._showAfterUpdatedMessage = true;
      }
    })
  }

  unDoData() {
    this._message = "";
    if (this.category.categoryId) this.loadCategoryById(this.category.categoryId);
  }

  _askToDelete: boolean = false;

  deleteCategoryProcess() {
    if (this.categoryId) {
      this.deleteCategory$ = this.categoryService.deleteCategory(this.categoryId).subscribe({
        next: value => { this.returnToViewMode(); }
      })
    }
  }

  isCategoryEmpty(): boolean {
    let answer: boolean = true;
    if (this.category.subcategories) {
      if (this.category.subcategories.length) {
        if (this.category.subcategories.length > 0) {
          answer = false;
        }
      }
    }
    if (this.category.products) {
      if (this.category.products.length) {
        if (this.category.products.length > 0) {
          answer = false;
        }
      }
    }

    return answer;
  }

}
