import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineConsumptionDialogComponent } from './medicine-consumption-dialog.component';

describe('MedicineConsumptionDialogComponent', () => {
  let component: MedicineConsumptionDialogComponent;
  let fixture: ComponentFixture<MedicineConsumptionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicineConsumptionDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicineConsumptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
