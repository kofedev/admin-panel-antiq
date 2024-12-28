import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiElementBigEditComponent } from './ui-element-big-edit.component';

describe('UiElementBigEditComponent', () => {
  let component: UiElementBigEditComponent;
  let fixture: ComponentFixture<UiElementBigEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UiElementBigEditComponent]
    });
    fixture = TestBed.createComponent(UiElementBigEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
