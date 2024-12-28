import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderExplorerComponent } from './order-explorer.component';

describe('OrderExplorerComponent', () => {
  let component: OrderExplorerComponent;
  let fixture: ComponentFixture<OrderExplorerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderExplorerComponent]
    });
    fixture = TestBed.createComponent(OrderExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
