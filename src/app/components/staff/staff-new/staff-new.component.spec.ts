import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffNewComponent } from './staff-new.component';

describe('StaffNewComponent', () => {
  let component: StaffNewComponent;
  let fixture: ComponentFixture<StaffNewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StaffNewComponent]
    });
    fixture = TestBed.createComponent(StaffNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
