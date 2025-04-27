import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineKitsListComponent } from './medicine-kits-list.component';

describe('MedicineKitsListComponent', () => {
  let component: MedicineKitsListComponent;
  let fixture: ComponentFixture<MedicineKitsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicineKitsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicineKitsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
