import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiElementEditComponent } from './ui-element-edit.component';

describe('UiElementEditComponent', () => {
  let component: UiElementEditComponent;
  let fixture: ComponentFixture<UiElementEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UiElementEditComponent]
    });
    fixture = TestBed.createComponent(UiElementEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
