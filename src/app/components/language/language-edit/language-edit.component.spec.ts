import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageEditComponent } from './language-edit.component';

describe('LanguageEditComponent', () => {
  let component: LanguageEditComponent;
  let fixture: ComponentFixture<LanguageEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LanguageEditComponent]
    });
    fixture = TestBed.createComponent(LanguageEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
