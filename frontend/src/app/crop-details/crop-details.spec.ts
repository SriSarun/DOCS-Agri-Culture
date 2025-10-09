import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CropDetails } from './crop-details';

describe('CropDetails', () => {
  let component: CropDetails;
  let fixture: ComponentFixture<CropDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CropDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CropDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
