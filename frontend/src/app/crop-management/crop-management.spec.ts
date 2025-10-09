import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CropManagement } from './crop-management';

describe('CropManagement', () => {
  let component: CropManagement;
  let fixture: ComponentFixture<CropManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CropManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CropManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
