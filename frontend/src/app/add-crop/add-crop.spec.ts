import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCrop } from './add-crop';

describe('AddCrop', () => {
  let component: AddCrop;
  let fixture: ComponentFixture<AddCrop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCrop]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCrop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
