import {Component, OnDestroy, OnInit} from '@angular/core';
import {Category} from "../../model/category";
import {CategoryService} from "../../services/category.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CurrentLanguageService} from "../../services/current-language.service";
import {ProductService} from "../../services/product.service";
import {Subscription} from "rxjs";
import {CategoryParent} from "../../model/category-parent";
import {Product} from "../../model/product";
import {UiElementService} from "../../services/ui-element.service";

@Component({
  selector: 'app-product-explorer',
  templateUrl: './product-explorer.component.html',
  styleUrls: ['./product-explorer.component.scss']
})
export class ProductExplorerComponent implements OnInit, OnDestroy {

  constructor(private categoryService: CategoryService,
              private productService: ProductService,
              private router: Router,
              private route: ActivatedRoute,
              public currentLanguageService: CurrentLanguageService,
              public uiElementService: UiElementService) { }

  categoryId: number | undefined;
  currentCategory!: Category;
  productList!: Product[];

  _inProgress: boolean = false;
  _showClone: boolean = false;

  click_in_category_tree_id$!: Subscription;
  languageIsSelected$!: Subscription;
  params$!: Subscription;
  createEmptyProductByParent$!: Subscription;
  getAllProductsByCategoryId_short$!: Subscription;
  getCategoryById$!: Subscription;
  cloneProductByPatternProductId$!: Subscription;

  ngOnDestroy(): void {
    if (this.click_in_category_tree_id$) this.click_in_category_tree_id$.unsubscribe();
    if (this.languageIsSelected$) this.languageIsSelected$.unsubscribe();
    if (this.params$) this.params$.unsubscribe();
    if (this.createEmptyProductByParent$) this.createEmptyProductByParent$.unsubscribe();
    if (this.getAllProductsByCategoryId_short$) this.getAllProductsByCategoryId_short$.unsubscribe();
    if (this.getCategoryById$) this.getCategoryById$.unsubscribe();
    if (this.cloneProductByPatternProductId$) this.cloneProductByPatternProductId$.unsubscribe();
  }


  ngOnInit(): void {
    this.params$ = this.route.params.subscribe(params => {
      this.categoryId = +params['categoryId'];
      if (this.categoryId != undefined) {
        this.loadCategoryById(this.categoryId);

      } else {
        console.error("There is no category's ID") }
    });

    this.languageIsSelected$ = this.currentLanguageService.languageIsSelected$.subscribe({
      next: value => { this.loadCategoryById(this.categoryId!); this.loadProductListByParentCategoryId(this.categoryId!); }
    })

    this.click_in_category_tree_id$ = this.categoryService.click_in_category_tree_id$.subscribe({
      next: value => {
        this.router.navigateByUrl("/product/category/" + this.categoryService.current_category_in_category_tree.categoryId).then(r => console.log("Routing"));
      }
    })

  }

  // **** category
  loadCategoryById(categoryId: number) {
    this.getCategoryById$ = this.categoryService.getCategoryById(categoryId).subscribe({
      next: category => {
        this.currentCategory = structuredClone(category);
        this.categoryService.current_category_in_category_tree = this.currentCategory; ////
        this.loadProductListByParentCategoryId(category.categoryId);
      }
    })
  }

  // **** load product list located in the current category
  loadProductListByParentCategoryId(parentCategoryId: number) {
    this.getAllProductsByCategoryId_short$ = this.productService.getAllProductsByCategoryId_short(parentCategoryId).subscribe({
      next: productList => {
        this.productList = structuredClone(productList);
      }
    })
  }

  // **** create new product and going to edit
  createNewEmptyProduct(parent: Category) {
      let parentCategory: CategoryParent = {
        categoryId: this.currentCategory.categoryId,
        active: true,
        root: false,
        titleDescriptors: []
      };
      this.createEmptyProductByParent$ = this.productService.createEmptyProductByParent(parentCategory).subscribe({
        next: value => {
          this.goToProductById(value.productId);
        }
      })
  }

  goToProductById(productId: number) {
    this.router.navigateByUrl("/product/edit/" + productId).then(r => console.log("Routing"));
  }

  cloneProduct(productId: number) {
    this._inProgress = true;
    this.cloneProductByPatternProductId$ = this.productService.cloneProductByPatternProductId(productId).subscribe({
      next: value => {
        this.loadCategoryById(this.categoryId!);
        this._inProgress = false;
      }
    })
  }

}
