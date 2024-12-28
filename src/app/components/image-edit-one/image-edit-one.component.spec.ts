import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageEditOneComponent } from './image-edit-one.component';

describe('ImageEditOneComponent', () => {
  let component: ImageEditOneComponent;
  let fixture: ComponentFixture<ImageEditOneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImageEditOneComponent]
    });
    fixture = TestBed.createComponent(ImageEditOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
