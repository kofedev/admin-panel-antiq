import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageNewComponent } from './language-new.component';

describe('LanguageNewComponent', () => {
  let component: LanguageNewComponent;
  let fixture: ComponentFixture<LanguageNewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LanguageNewComponent]
    });
    fixture = TestBed.createComponent(LanguageNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
