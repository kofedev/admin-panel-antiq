import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EnvironmentService} from "./environment.service";
import {Observable} from "rxjs";
import {Order} from "../model/order";
import {OrderNote} from "../model/order-note";
import {OrderStatus} from "../model/order-status";

@Injectable({
  providedIn: 'root'
})
export class OrderService {


  constructor(private http: HttpClient, private environment: EnvironmentService) {}

  public getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.environment.baseUrl + "/order");
  }

  public getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(this.environment.baseUrl + "/order/" + orderId);
  }

  public updateOrderNote(orderId: number, orderNote: OrderNote): Observable<Order> {
    console.log("note: " + orderNote.note)
    return this.http.put<Order>(this.environment.baseUrl + "/order/note/" + orderId, orderNote);
  }

  public updateOrderStatus(orderId: number, orderStatus: OrderStatus): Observable<Order> {
    return this.http.put<Order>(this.environment.baseUrl + "/order/status/" + orderId, orderStatus);
  }

  public deleteOrder(orderId: number): Observable<any> {
    return this.http.delete<any>(this.environment.baseUrl + "/order/" + orderId);
  }

  public getOrdersByProductId(productId: number): Observable<Order[]> {
    return this.http.get<Order[]>(this.environment.baseUrl + "/order/byproduct/" + productId);
  }

}
