import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackupDataComponent } from './backup-data.component';

describe('BackupDataComponent', () => {
  let component: BackupDataComponent;
  let fixture: ComponentFixture<BackupDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BackupDataComponent]
    });
    fixture = TestBed.createComponent(BackupDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
