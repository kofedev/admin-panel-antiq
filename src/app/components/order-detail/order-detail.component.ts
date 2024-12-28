import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {OrderService} from "../../services/order.service";
import {Order} from "../../model/order";
import {DatePipe, NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {OrderStatus} from "../../model/order-status";
import {OrderNote} from "../../model/order-note";
import {OrderByDatePipe} from "../../pipes/order-by-date.pipe";
import {CurrentLanguageService} from "../../services/current-language.service";
import {AuthService} from "../../services/auth.service";
import {UiElementService} from "../../services/ui-element.service";

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    NgForOf,
    OrderByDatePipe
  ],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent implements OnInit, OnDestroy {

  params$!: Subscription;
  getOrderById$!: Subscription;
  updateOrderNote$!: Subscription;
  updateOrderStatus$!: Subscription;
  deleteOrder$!: Subscription;
  orderId!: number;
  order!: Order;
  note: string = '';
  status!: boolean;
  deleteOrderAskToProcessing = false;

  constructor(private route: ActivatedRoute,
              private orderService: OrderService,
              public currentLanguageService: CurrentLanguageService,
              private router: Router,
              public auth: AuthService,
              public uiElementService: UiElementService) {}

  ngOnDestroy() {
    if (this.params$) this.params$.unsubscribe();
    if (this.getOrderById$) this.getOrderById$.unsubscribe();
    if (this.updateOrderNote$) this.updateOrderNote$.unsubscribe();
    if (this.updateOrderStatus$) this.updateOrderStatus$.unsubscribe();
    if (this.deleteOrder$) this.deleteOrder$.unsubscribe();
  }

  ngOnInit() {
    this.params$ = this.route.params.subscribe(params => {
      this.orderId = +params['orderId'];
      if (this.orderId != undefined) {
        this.loadOrderById(this.orderId);
      } else {
        console.error("There is no order's ID") }
    });
  }

  loadOrderById (orderId: number) {
    this.getOrderById$ = this.orderService.getOrderById(orderId).subscribe({
      next: value => {
        this.order = structuredClone(value);
        this.note = value.note;
        this.status = value.active;
      }
    })
  }

  saveNote() {
    let orderNote: OrderNote = {
      note: this.note
    }
    this.updateOrderNote$ = this.orderService.updateOrderNote(this.order.orderId, orderNote).subscribe({
      next: value => {
        this.order = structuredClone(value);
        this.note = value.note;
        this.status = value.active;
      }
    })
  }

  saveStatus() {
    let orderStatus: OrderStatus = {
      status: this.status
    }
    this.updateOrderStatus$ = this.orderService.updateOrderStatus(this.order.orderId, orderStatus).subscribe({
      next: value => {
        this.order = structuredClone(value);
        this.note = value.note;
        this.status = value.active;
      }
    })
  }

  goToProductById(productId: number) {
    this.router.navigateByUrl("/product/info/" + productId).then(r => console.log());
  }

  deleteOrder() {
    this.deleteOrder$ = this.orderService.deleteOrder(this.orderId).subscribe({
      next: value => {
        this.router.navigateByUrl("/order").then(r => console.log());
      }
    })

  }

}
