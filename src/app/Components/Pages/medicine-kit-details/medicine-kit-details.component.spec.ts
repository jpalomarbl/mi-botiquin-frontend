import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineKitDetailsComponent } from './medicine-kit-details.component';

describe('MedicineKitDetailsComponent', () => {
  let component: MedicineKitDetailsComponent;
  let fixture: ComponentFixture<MedicineKitDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicineKitDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicineKitDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
