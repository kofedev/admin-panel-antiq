import {Component, OnDestroy, OnInit} from '@angular/core';
import {Product} from "../../model/product";
import {ProductService} from "../../services/product.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CurrentLanguageService} from "../../services/current-language.service";
import {Subscription} from "rxjs";
import {UiElementService} from "../../services/ui-element.service";
import {Order} from "../../model/order";

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrl: './product-info.component.scss'
})
export class ProductInfoComponent implements OnInit, OnDestroy {

  productId: number | undefined;
  product!: Product;
  orders: Order[] = [];
  _inProgress: boolean = false;
  _showAfterUpdatedMessage: boolean = false;

  constructor(private productService: ProductService,
              private router: Router,
              private route: ActivatedRoute,
              public currentLanguageService: CurrentLanguageService,
              public uiElementService: UiElementService) {}

  getProductById_full$!: Subscription;
  params$!: Subscription;

  ngOnDestroy() {
    if (this.params$) this.params$.unsubscribe();
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
  }

  // loadProductById (productId: number) {
  //   this.getProductById_full$ = this.productService.getProductById_full(productId).subscribe({
  //     next: value => {
  //       this.product = structuredClone(value);
  //     }
  //   })
  // }

  loadProductById (productId: number) {
    this.getProductById_full$ = this.productService.getProductById_full_orders(productId).subscribe({
      next: value => {
        this.product = structuredClone(value.product);
        this.orders = structuredClone(value.orders);
      }
    })
  }

  goToEditProduct(){
    this.router.navigateByUrl("/product/edit/" + this.product.productId).then(r => console.log());
  }

  goToOrderById(orderId: number) {
    this.router.navigateByUrl("/order/detail/" + orderId).then(r => console.log());
  }


}
