import {Component, OnDestroy, OnInit} from '@angular/core';
import {OrderService} from "../../services/order.service";
import {Order} from "../../model/order";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {UiElementService} from "../../services/ui-element.service";

@Component({
  selector: 'app-order-explorer',
  templateUrl: './order-explorer.component.html',
  styleUrls: ['./order-explorer.component.scss']
})
export class OrderExplorerComponent implements OnInit, OnDestroy {

    orderList: Order[] = [];
    getAllOrders$!: Subscription;

    constructor(public orderService: OrderService,
                private router: Router,
                public uiElementService: UiElementService) { }

    ngOnDestroy(): void {
      if (this.getAllOrders$) this.getAllOrders$.unsubscribe();
    }

    ngOnInit(): void {
      this.loadOrderList();
    }

    loadOrderList() {
      this.getAllOrders$ = this.orderService.getAllOrders().subscribe({
        next: value => {
          this.orderList = structuredClone(value);
        }
      })
    }

    goToOrder(orderId: number) {
      this.router.navigateByUrl("/order/detail/" + orderId).then(r => console.log());
    }

}
