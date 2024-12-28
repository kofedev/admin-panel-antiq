import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiElementBigComponent } from './ui-element-big.component';

describe('UiElementBigComponent', () => {
  let component: UiElementBigComponent;
  let fixture: ComponentFixture<UiElementBigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UiElementBigComponent]
    });
    fixture = TestBed.createComponent(UiElementBigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
