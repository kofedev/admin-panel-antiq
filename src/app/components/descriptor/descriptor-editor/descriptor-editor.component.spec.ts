import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptorEditorComponent } from './descriptor-editor.component';

describe('DescriptorEditorComponent', () => {
  let component: DescriptorEditorComponent;
  let fixture: ComponentFixture<DescriptorEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DescriptorEditorComponent]
    });
    fixture = TestBed.createComponent(DescriptorEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
