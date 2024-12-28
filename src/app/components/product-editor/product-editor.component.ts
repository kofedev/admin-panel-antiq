import {Component, OnDestroy, OnInit} from '@angular/core';
import {CategoryService} from "../../services/category.service";
import {ProductService} from "../../services/product.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CurrentLanguageService} from "../../services/current-language.service";
import {Product} from "../../model/product";
import {Subscription} from "rxjs";
import {Category} from "../../model/category";
import {Order} from "../../model/order";
import {UiElementService} from "../../services/ui-element.service";

@Component({
  selector: 'app-product-editor',
  templateUrl: './product-editor.component.html',
  styleUrls: ['./product-editor.component.scss']
})
export class ProductEditorComponent implements OnInit, OnDestroy {

  productId: number | undefined;
  product!: Product;
  orders!: Order[];
  originalParentID!: number;
  _inProgress: boolean = false;
  _showCategoryTreeToSelectNewLocation: boolean = false;
  _seeDeleteQuestion: boolean = false;
  _showAfterUpdatedMessage: boolean = false;

  constructor(private categoryService: CategoryService,
              private productService: ProductService,
              private router: Router,
              private route: ActivatedRoute,
              public currentLanguageService: CurrentLanguageService,
              public uiElementService: UiElementService) { }

  click_in_category_tree_id$!: Subscription;
  deleteProduct$!: Subscription;
  updateProduct$!: Subscription;
  getProductById_full$!: Subscription;
  params$!: Subscription;
  // getCategoryById$!: Subscription;
  currentCategory!: Category;

  ngOnDestroy() {
    if (this.click_in_category_tree_id$) this.click_in_category_tree_id$.unsubscribe();
    if (this.deleteProduct$) this.deleteProduct$.unsubscribe();
    if (this.updateProduct$) this.updateProduct$.unsubscribe();
    if (this.params$) this.params$.unsubscribe();
    // if (this.getCategoryById$) this.getCategoryById$.unsubscribe();
    if (this.getProductById_full$) this.getProductById_full$.unsubscribe();
  }

  ngOnInit(): void {
    this.params$ = this.route.params.subscribe(params => {
      this.productId = +params['productId'];
      if (this.productId != undefined) {
        this.loadProductById(this.productId);
      } else {
        console.error("There is no category's ID") }
    });
    this.click_in_category_tree_id$ = this.categoryService.click_in_category_tree_id$.subscribe({
      next: value => {
        if (this._showCategoryTreeToSelectNewLocation) {
          this.product.category = structuredClone(this.categoryService.current_category_in_category_tree);
        }
      }
    })
  }

  // loadProductById (productId: number) {
  //   this.getProductById_full$ = this.productService.getProductById_full(productId).subscribe({
  //     next: value => {
  //       this.product = structuredClone(value);
  //       this.originalParentID = value.category.categoryId;
  //       this.getCategoryById$ = this.categoryService.getCategoryById(this.product.category.categoryId).subscribe({
  //         next: category => { this.currentCategory = structuredClone(category); }
  //       })
  //     }
  //   })
  // }

  loadProductById (productId: number) {
    this.getProductById_full$ = this.productService.getProductById_full_orders(productId).subscribe({
      next: value => {
        this.product = structuredClone(value.product);
        this.orders = structuredClone(value.orders);
        //
        //
        this.originalParentID = value.product.category.categoryId;
        // this.getCategoryById$ = this.categoryService.getCategoryById(this.product.category.categoryId).subscribe({
        //   next: category => { this.currentCategory = structuredClone(category); }
        // })
        this.currentCategory = structuredClone(value.category);
      }
    })
  }

  updateProduct () {
    this.updateProduct$ = this.productService.updateProduct(this.product).subscribe({
      next: value => {
        //console.log("Updated?");
        // if prev location != updated location (original parent) then send signal
        // if (value.category.categoryId != this.originalParentID) {
          // this.productService.productLocationChanged$.next(value.category.categoryId);
        //this.originalParentID = value.category.categoryId;
        this._showAfterUpdatedMessage = true;
        // }
        this.loadProductById(this.productId!);
      }
    })
  }

  setCurrentCategoryInTree() {
    this.categoryService.current_category_in_category_tree = this.product.category;
  }

  returnToViewMode(){
    window.history.back();

    // this.router.navigateByUrl("/product/category/" + this.originalParentID).then(r => console.log("Routing"));
  }

  parseDate(value: string): Date {
    // Parse the string and return a Date object
    return new Date(value);
  }

  deleteProductSecondStepProcess() {
    this.originalParentID = this.product.category.categoryId;
    this.deleteProduct$ = this.productService.deleteProduct(this.productId!).subscribe({
      next: value => {
        this.router.navigateByUrl("/product/category/" + this.originalParentID).then(r => console.log("Routing"));
      }
    })
  }

  goToOrderById(orderId: number) {
    this.router.navigateByUrl("/order/detail/" + orderId).then(r => console.log());
  }

  //
  // HTML: (keydown)="onKeyDown($event)"
  //
  // onKeyDown(event: KeyboardEvent): void {
  //   // Check if the Ctrl key is pressed and the key code is 'S'
  //   if (event.ctrlKey && event.key === 's') {
  //     //event.preventDefault(); // Prevent the default browser behavior (e.g., save page)
  //     console.log('Ctrl + S pressed');
  //     // Add your save logic or any other actions here
  //   }
  // }

}
