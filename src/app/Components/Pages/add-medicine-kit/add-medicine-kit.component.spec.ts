import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMedicineKitComponent } from './add-medicine-kit.component';

describe('AddMedicineKitComponent', () => {
  let component: AddMedicineKitComponent;
  let fixture: ComponentFixture<AddMedicineKitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMedicineKitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMedicineKitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
